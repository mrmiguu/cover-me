import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import mammoth from 'mammoth'
import './styles/App.css'

class App extends Component {

  state = {}
  
  render() {
    const { letter } = this.state
    
    return (
      <div className="App">

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

            this.setState({ letter: value })
          }}

        /><label htmlFor="upload-button">

          <Button variant="contained" component="span">
            Upload Template
          </Button>
          
        </label>

        <Dialog open={!!letter}>
          <pre>
            {letter}
          </pre>
        </Dialog>
      
      </div>
    )
  }
}

export default App
