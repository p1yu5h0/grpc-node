const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')

const packageDefinition = protoLoader.loadSync('./todo.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition)

var todoService = protoDescriptor.TodoService;

const client = new todoService('localhost:50051', grpc.credentials.createInsecure());


client.listTodos({}, (err, todos) => {
    if(!err){
        console.log(todos);
        client.createTodos({
            id: 69,
            title: "piyush",
            content: "piyush likes 69"
        }, (err, todo)=>{
            if(!err){
                console.log('created a new todo', todo);
            } else {
                console.log('error');
            }
        })
        client.listTodos({}, (err, todos) => {
            if(!err){
                console.log(todos);
            }
        })
    }
})
