import React, { Component } from 'react'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import FileCopy from '@material-ui/icons/FileCopy'
import TextField from '@material-ui/core/TextField'
import Fab from '@material-ui/core/Fab'

import mammoth from 'mammoth'

import './styles/App.css'

class App extends Component {

  state = {}
  
  render() {
    const { template, letter } = this.state

    const keyWords = (template||'').match(/\b[A-Z_]{3,}\b/g)

    return (
      <div className={template? 'App-2' : 'App'}>

        {
          template? <>
            {
              keyWords.map((keyWord, i) =>
                <TextField
                  key={i}
                  required
                  margin="normal"
                  label={keyWord}
                  value={this.state[keyWord] || ''}
                  onChange={e => this.setState({ [keyWord]: e.target.value })}
                />
              )
            }

            <Fab
              style={{
                position: `fixed`,
                right: 0,
                bottom: 0,
                margin: `1em`,
              }}
              color="primary"
              aria-label="Copy"

              onClick={e => this.setState({
                letter: Object.keys(this.state)
                  .filter(key => key.replace('_', '').toUpperCase() === key.replace('_', ''))
                  .reduce(
                    (letterInProgress, keyWord) => letterInProgress.replace(keyWord, this.state[keyWord]),
                    template
                  )
              })}
            >
              <FileCopy />
            </Fab>

            <Dialog open={!!letter} onClose={() => {}}>
              <pre>
                {letter}
              </pre>
            </Dialog>

          </> : <>

            <input
              hidden
              multiple
              accept =".doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              id     ="upload-button"
              type   ="file"

              /** process uploaded file */
              onChange={async e => {
                const blob = e.target.files[0]
                const arrayBuffer = await new Response(blob).arrayBuffer()
                
                const { value, messages } = await mammoth.extractRawText({ arrayBuffer })
                if (messages && messages.length) console.warn(messages)
                console.log(value)

                this.setState({ template: value })
              }}

            /><label htmlFor="upload-button">

              <Button variant="contained" component="span">
                Upload Template
              </Button>
              
            </label>

          </>
        }
      
      </div>
    )
  }
}

export default App
