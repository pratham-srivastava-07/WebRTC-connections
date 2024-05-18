import { useEffect, useState } from "react"



export default function Sender() {

    const [socket, setSocket] = useState<WebSocket | null>(null)
    const [pc, setPc] = useState<RTCPeerConnection | null>(null)

    useEffect(()=> {
        const socket = new WebSocket("ws:localhost:8080")
        setSocket(socket)

        socket.onopen = () => {
            socket.send(JSON.stringify({
                type: 'sender'
            }))
        }
    },[])

    const initiateConnection = () => {
        if(!socket) {
            alert("socket not found")
            return;
        }
        socket.onmessage = async (event) => {
            const msg = JSON.parse(event.data)
            if(msg.type === "createAnswer") {
                await pc?.setRemoteDescription(msg.sdp)
            } else if(msg.type === "IceCandidate") {
                await pc?.addIceCandidate(msg.IceCandidate);
            }
        }
        const pc = new RTCPeerConnection();

        setPc(pc);

        pc.onicecandidate = (event) => {
            if(event.candidate) {
                socket.send(JSON.stringify({
                    type: 'iceCandidate',
                    candidate: event.candidate
                }))
            }
        }

        pc.onnegotiationneeded = async () => {
            const offer = await pc.createOffer();

            await pc.setLocalDescription(offer)

            socket.send(JSON.stringify({
                type: 'createOffer',
                sdp: pc.localDescription
            }))
        }
        getCameraStreamAndSend(pc)
    }

    const getCameraStreamAndSend = (pc: RTCPeerConnection) => {
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
            const video = document.createElement('video');
            video.srcObject = stream;
            video.play();
            document.body.appendChild(video);
            stream.getTracks().forEach((track) => {
                pc?.addTrack(track);
            });
        });
    }



    return(
        <div>
            Sender
            <button className="p-4 border-black" onClick={initiateConnection}> Send data </button>
        </div>
    )
}

function getCameraStreamAndSend(pc: RTCPeerConnection) {
    throw new Error("Function not implemented.")
}
