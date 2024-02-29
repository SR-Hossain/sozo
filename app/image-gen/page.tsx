"use client";

import React, { useRef, useState } from 'react';
import LoadingWidget from '@/components/LoadingWidget';

const MyComponent: React.FC = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [showProfileDialog, setShowProfileDialog] = useState<boolean>(false);


    const handleDownload = async (imageUrl: string) => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
    
            // Set the content type explicitly
            const contentType = 'image/jpeg'; // Replace with the actual content type of your image
    
            const link = document.createElement('a');
            link.href = URL.createObjectURL(new Blob([blob], { type: contentType }));
            link.download = `downloaded_image_${new Date().getTime()}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading image:', error);
        }
    };
    

    const handleProfileClick = () => {
        setShowProfileDialog(true);
    };

    const handleCloseProfileDialog = () => {
        setShowProfileDialog(false);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setImageUrls([]);
        const prompt = inputRef.current?.value || '';

        try {
            const response = await fetch('/api/gen', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: prompt }),
            });

            const data = await response.json();
            setImageUrls((prevImageUrls) => [...prevImageUrls, ...data.imageUrls]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='h-full overflow-y-auto overflow-x-hidden'>
            <style>
                {`
                .btn, .selected_question {
                        font-size: 16px; 
                        font-weight: 600; 
                        color: #f5f5f5;
                        cursor: pointer;
                        text-align:left;
                        border: none;
                        background-size: 300% 100%;
                    
                        border-radius: 10px;
                        moz-transition: all .4s ease-in-out;
                        -o-transition: all .4s ease-in-out;
                        -webkit-transition: all .4s ease-in-out;
                        transition: all .4s ease-in-out;
                    
                        background-image: linear-gradient(to right, #29323c, #485563, #2b5876, #4e4376);
                        box-shadow: 0 4px 15px 0 rgba(45, 54, 65, 0.75);
                    
                    }
                    
                    .btn:hover, .btn.selected_post{
                        background-position: 100% 0;
                        moz-transition: all .4s ease-in-out;
                        -o-transition: all .4s ease-in-out;
                        -webkit-transition: all .4s ease-in-out;
                        transition: all .4s ease-in-out;
                    }
                    
                    .btn.selected_post {
                    
                        background-image: linear-gradient(to right, #2b2c2e, #485563, black, black) !important;
                        box-shadow: 0 4px 15px 0 rgba(45, 54, 65, 0.75);
                    }
                    
                    
                    .btn:focus {
                        outline: none;
                    }

                    .fullscreen-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.8);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 1000;
                        cursor: pointer;
                    }
    
                    .fullscreen-image {
                        max-width: 90%;
                        max-height: 90%;
                        object-fit: contain;
                        cursor: pointer;
                    }
                `}
            </style>
            <div className='flex flex-row gap-5 p-5'>
                <div className='cursor-pointer' onClick={handleProfileClick}>
                    <img src="https://github.com/SR-Hossain.png" alt="Your Picture" className="w-12 h-12 rounded-full" />
                </div>
                <input
                    ref={inputRef}
                    className='h-12 p-4 btn'
                    type='text'
                    placeholder="Enter your prompts"
                />
                <button className='btn px-6 py-2' onClick={handleSubmit}>Generate pictures!</button>
            </div>
            {loading && <div className='center'><LoadingWidget /></div>}

            {!loading && imageUrls.length > 0 && (
                <div className='flex flex-wrap p-10 gap-10'>
                    {imageUrls.map((url, index) => (
                        <div key={index} style={{ overflow: 'hidden', borderRadius: '10px', width: '42vw', position: 'relative' }}>
                            <img src={url} alt={`Generated ${index + 1}`} style={{ width: '100%', objectFit: 'cover', margin: '0 0 -70px 0' }} />
                            <div className="w-24 btn p-3" onClick={(e) => { e.stopPropagation(); handleDownload(url); }}>
                                Download
                            </div>
                        </div>
                    ))}
                </div>
            )}

{showProfileDialog && (
    <div className='fullscreen-overlay' onClick={handleCloseProfileDialog}>
        <div className='p-5 bg-dark-mode rounded-md'>
            <div className='flex flex-col items-center'>
                <img src="https://github.com/SR-Hossain.png" className="w-40 h-40 rounded-full mb-3" />
                <h2 className='text-white text-lg font-bold mb-2'>Syed Sazid Hossain Rezvi</h2>
                <p className='text-gray-300 text-sm mb-4'>Fullstack Software Engineer</p>
                <a href="mailto:ssh.rezvi@gmail.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Contact: ssh.rezvi@gmail.com</a>
                <a href="https://github.com/SR-Hossain/sozo" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">GitHub Repository of This Project</a>
            </div>
        </div>
    </div>
)}


        </div>
    );
};

export default MyComponent;
