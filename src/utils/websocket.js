export const createWebsocket = (url, onMessage) =>{
    const socket = new WebSocket(url);

    socket.addEventListener('open', ()=>{
        console.log('Websocket Connection Opened');
    });

    socket.addEventListener('message', (event)=>{
        if(onMessage){
            onMessage(event.data);
        }
        console.log('Message have been added!')
    });

    socket.addEventListener('error', (error) => {
        console.error('WebSocket Error:', error);
      });
    
      socket.addEventListener('close', (event) => {
        console.log('WebSocket Connection Closed', event.code, event.reason);
      });
    

    return socket;
}

export default createWebsocket