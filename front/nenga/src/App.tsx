import * as React from 'react';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const url = "http://localhost:8000"
const initImage = "https://i.imgur.com/mfYPqRr.png"

export const App: React.FC = () => {
    const initFile: File = new File([], "")
    const [name, setName] = React.useState("");
    const [title, setTitle] = React.useState("");
    const [msg, setMsg] = React.useState("");
    const [selectedFile, setSelectedFile] = React.useState(initFile);
    const [selectedFileName, setSelectedFileName] = React.useState("")
    const [previewImage, setPreviewImage] = React.useState(initImage);

    const getBase64 = async(file: File): Promise<string | ArrayBuffer | null> => {
        let b64str: string | ArrayBuffer | null = "";
        let reader = new FileReader();
        reader.readAsDataURL(file);
        return new Promise((resolve, reject) => {
            reader.onload = (e) => {
                console.log(e.target)
                b64str = e.target !== null ? e.target.result : ''
                resolve(b64str)
            };
            reader.onerror = (error) => {
                console.log('Error: ', error);
                return reject(error)
            };
        });
    };

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        const image = await getBase64(selectedFile)
        const data = { title, name, message: msg, image}
        console.log(data)
        try {
            const result = await axios.post(url + '/send', data
            );
            console.log(result);
        } catch (error) {
            console.log('error!!');
        }
    };

    const handlePreview = async(e: React.FormEvent) => {
        e.preventDefault();
        const image = await getBase64(selectedFile)
        const data = { title, name, message: msg, image}
        console.log(data)
        try {
            const result = await axios.post(url + '/preview', data
            );
            console.log(result);
            setPreviewImage(result.data.image.image)
        } catch (error) {
            console.log('error!!');
        }
    };

    return (
        <div className="max-w-2xl bg-white py-10 px-5 m-auto w-full mt-10">
            <div className="grid grid-cols-1 gap-4 max-w-xl m-auto bg-indigo-500 shadow-2xl rounded-lg text-center py-12 mt-4">
                <span className="text-3xl leading-9 font-bold tracking-tight text-white sm:text-4xl sm:leading-10">
                    <FontAwesomeIcon icon={['fas', 'broadcast-tower']} />
                    &nbsp;Send MQTT Nenga&nbsp;
                    <FontAwesomeIcon icon={['fas', 'paper-plane']} />
                </span>
                <h3 className="text-base leading-9 font-bold tracking-tight text-white sm:text-base sm:leading-10">
                    Send New Year's cards via MQTT and display them on e-paper!
                </h3>
            </div>
            <div className="grid grid-cols-1 gap-4 max-w-xl m-auto">
                <form>
                    <div className="col-span-2 lg:col-span-1">
                        <input type="text" className="border-solid border-gray-400 border-2 p-3 md:text-xl w-full"
                               placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}/>
                    </div>
                    <div className="col-span-2 lg:col-span-1">
                        <input type="text" className="border-solid border-gray-400 border-2 p-3 md:text-xl w-full"
                               placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}/>
                    </div>
                    <div className="col-span-2">
                        <input type="text" className="border-solid border-gray-400 border-2 p-3 md:text-xl w-full"
                               placeholder="Message" value={msg} onChange={(e) => setMsg(e.target.value)}/>
                    </div>
                    <div className="border border-solid border-gray-500 relative col-span-2">
                        <input type="file" accept="image/jpeg"
                               className="cursor-pointer relative block opacity-0 w-full h-full p-20 z-50"
                               onChange={async(e) => {
                                   setSelectedFile(e.target.files !== null ? e.target.files[0]: initFile)
                                   setSelectedFileName(e.target.value)
                               }}/>
                        <div className="text-center p-10 absolute top-0 right-0 left-0 m-auto">
                            <h4>
                                Drop JPEG image anywhere to upload
                                <br/>or
                            </h4>
                            <p className="">Select Files: {selectedFileName}</p>
                        </div>
                    </div>
                    <div className="bg-light-blue-300 py-6">
                        <img className="object-scale-down h-48 w-full " src={previewImage}  alt="preview"/>
                    </div>
                    <div className="col-span-2 text-right">
                        <button onClick={handlePreview} className="w-1/2 px-4 py-3 text-center bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-black font-bold rounded-lg text-sm">Preview
                        </button>
                        <button onClick={handleSubmit} className="w-1/2 px-4 py-3 text-center text-pink-100 bg-pink-600 rounded-lg hover:bg-pink-700 hover:text-white font-bold text-sm">Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

};

export default App;
