import React from 'react';
import PropTypes from 'prop-types';
import "./FileInput.sass";
import InputText from "../inputText/input";

const FileInput = props => {

    let realUploadButton = React.createRef();
    const [fileName, setFileName] = React.useState('Nenhum arquivo selecionado.');
    const [fileURL, setFileURL] = React.useState('');
    const onChange = e => {
        if (e.target.files[0]) {
            setFileName(e.target.files[0].name);
            setFileURL(URL.createObjectURL(e.target.files[0]))
            props.onChangeFile(e.target.files[0]);
        } else {
            setFileURL('');
            setFileName('Nenhum arquivo selecionado.');
        }
    }

    const [isURL, setURL] = React.useState(false);

    return (
        <div className={'preview_input_container'}>
            <div className={'file_input_container'}>
                <img
                    alt={'Preview'}
                    src={fileURL === '' ? require('../../preview.jpg') : fileURL}/>
                <input type={'file'}
                       name={props.fileName}
                       id={'real_file'}
                       onChange={onChange}
                       hidden
                       accept={'image/png, image/jpeg, image/jpg'}
                       ref={realUploadButton}/>
                <div className={'buttons'}>
                    <button
                        disabled={isURL}
                        onClick={() => setURL(true)}
                        className={isURL ? 'button_secondary selected' : 'button_secondary'}>
                        URL
                    </button>
                    <button disabled={!isURL}
                            onClick={() => setURL(false)}
                            className={!isURL ? 'button_secondary selected' : 'button_secondary'}>
                        Arquivo
                    </button>
                </div>
                <div className={'arquivo_upload'} style={!isURL ? {} : {display: 'none'}}>
                    <button type={'button'} onClick={() => {
                        realUploadButton.current.click();
                    }}>
                        <i className={'fa fa-upload'}/>
                    </button>
                    <span>{fileName}</span>
                </div>
                <InputText
                    name={props.urlName}
                    style={!isURL ? {display: 'none'} : {width: '100%'}}
                    label={'URL da foto'}
                    onChange={e => {
                        setFileURL(e.target.value);
                    }}/>
            </div>
        </div>
    )
}

FileInput.propTypes = {
    onChangeFile: PropTypes.func,
    data: PropTypes.any,
    setData: PropTypes.func,
    fileName: PropTypes.string.isRequired,
    urlName: PropTypes.string.isRequired,
}


export default FileInput;