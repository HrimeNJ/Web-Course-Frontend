import * as axios from 'axios';

const client = axios.default;

client.get('http://localhost:127.0.0.1:7001').then((response) => {
    console.log(response);
})

client.post('http://localhost:127.0.0.1:7001/Create', {
    name: '界面设计',
    descriotion: '设计敏捷看板',
},
    {
        headers: {
            'Content-Type': 'application/json',
        },
    }
).then((response) => {
    console.log(response);
})

