import React, { Component } from 'react'
import api from '../../services/api'
import { distanceInWords } from  'date-fns'
import pt from 'date-fns/locale/pt'
import Dropzone from 'react-dropzone'
import socket from 'socket.io-client'

//Material icons
import { MdInsertDriveFile } from 'react-icons/md'

import './styles.css'
import logo from '../../assets/logo.svg'

export default class Box extends Component {
    state = {
        box: {}
    }

    async componentDidMount() {
        this.subcribeToNewFiles()

        const box = this.props.match.params
        const response = await api.get(`boxes/${box}`, {})

        this.setState =({ box: response.data })
    }

    subcribeToNewFiles() {
        const box = this.props.match.params.id
        const io = socket('https://minidrop-backend.herokuapp.com/')
        
        // 'router' from backend
        io.emit('connectRoom', box)

        io.on('file', data => {
            //Study this syntax
            this.setState({
                 box: { ... this.state.box,
                 files: [data, ... this.state.box.files] } 
            })
        })
    }
    // Array of files
    handleUpload = (files) => {
        files.forEach(f => {
            const data = new FormData()
            const box = this.props.match.params.id

            // Name from backend
            data.append('file', f)

            api.post(`boxes/${box}/files`, data)
        })
    }

    render() {
        return(
            <div id="box-container">
                <header>
                    <img src={logo} alt="logo"/>
                    <h1>{this.state.box.title}</h1>
                </header>

                
                <Dropzone onDropAccepted={this.handleUpload}>
                    {( {getRootProps, getInputProps}) => (
                        <div className="upload" {...getRootProps()}>
                            <input {...getInputProps()} />
                            <p>Arrate arquivos ou clique aqui</p>
                        </div>
                    )}
                </Dropzone>

                <ul>
                    { this.state.box.file && this.state.box.file.map(file => (
                    <li key={file._id}>
                        <a className="fileInfo" href={file.url} target="_blank">
                            <MdInsertDriveFile size={24} color="#A4Cfff"/>
                            <strong>{file.title}</strong>
                        </a>
                        <span>
                        há{" "}
                        {distanceInWords(file.createdAt, new Date(), {
                            locale: pt
                        })}</span>
                    </li>
                    )) }
                </ul>
            </div>
        )
    }
}

