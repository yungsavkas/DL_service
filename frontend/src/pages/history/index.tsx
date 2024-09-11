import React, {useEffect, useState} from 'react';
import {Card, CardHeader, CardBody, CircularProgress} from '@nextui-org/react';
import { Image } from '@nextui-org/react';
import { Link } from 'react-router-dom';
import axios from "axios";
import {IVideo} from "../../types/interfaces";


export default function HistoryPage() {
    const [isLoad, setLoad] = useState<Boolean>(true);
    const [videos, setVideos] = useState<IVideo[]>([]);

    useEffect(()=>{
        const fetchHistory = async () => {
            setLoad(true);
            try {
                const { data } = await axios.get('http://79.175.45.64:8000/api/video');
                setVideos(data.video.reverse());
            } catch (e) {
                console.log(e);
            } finally {
                setLoad(false);
            }
        }
        fetchHistory();
    },[]);

    if (isLoad) return (
        <div style={{ height: 'calc(100vh - 65px)', padding: '50px', maxWidth: '1200px', margin: '0 auto' }}>
            <CircularProgress style={{margin: '0 auto'}} size="lg" aria-label="Loading..."/>
        </div>
    );

    return (
        <div style={{ height: 'calc(100vh - 65px)', padding: '50px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '20px',
            }}>
                {videos.length > 0 && videos.map((video) => (
                    <Link to={`/history/${video._id}`} key={video._id} style={{ textDecoration: 'none' }}>
                        <Card className="py-4">
                            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                                <p className="text-tiny uppercase font-bold">{video.folder_name.split('/')[1]}</p>
                                <small className="text-default-500">
                                    {new Date(video.createdAt).toLocaleDateString()} {new Date(video.createdAt).toLocaleTimeString()}
                                </small>
                                <h4
                                    className="font-bold text-large"
                                    style={{color: video.status === 'pending' ? '#ffb938f2' : '#1cba1c'}}
                                >
                                    {video.status}
                                </h4>
                            </CardHeader>
                            <CardBody className="overflow-hidden py-2">
                                <div className="relative w-full h-[150px]">
                                    <img
                                        alt={`Thumbnail of ${video.folder_name}`}
                                        className="object-cover w-full h-full rounded-xl"
                                        src={`http://79.175.45.64:8000/${video.folder_name}1.png`}
                                    />
                                </div>
                            </CardBody>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}

