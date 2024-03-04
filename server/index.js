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

const server = new grpc.Server();

const todos = [
    {
        id: "1",
        title: "todo1",
        content: "content of todo 1"
    },
    {
        id: "2",
        title: "todo2",
        content: "content of todo 2"
    },
    {
        id: "3",
        title: "todo3",
        content: "content of todo 3"
    },
];

server.addService(todoService.service, {
    listTodos: (call, callback) => {
        console.log(call);
        callback(null, {
            todos
        });
    },
    createTodos: (call, callback) => {
        let incomingNewTodo = call.request;
        todos.push(incomingNewTodo);
        console.log(todos);
        callback(null, incomingNewTodo);
    },
    getTodos: (call, callback) => {
        let incomingTodoRequest = call.request;
        let todoId = incomingTodoRequest.id;
        const response = todos.filter((todo) => todo.id = todoId);
        if(response.length>0){
            callback(null, response);
        } else {
            callback({
                msg: "todo not found"
            }, null)
        }
    }
});

server.bindAsync('127.0.0.1:50051', grpc.ServerCredentials.createInsecure(), () => {
    console.log('server started');
    server.start();
});