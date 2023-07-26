const Ticket = require('./js/Ticket');
const TicketFull = require('./js/TicketFull');
const getCreationDate = require('./js/createDateTicket')
const { performance } = require('perf_hooks')

const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const cors = require('@koa/cors');

const app = new Koa();

app.use(cors({
  origin: '*',
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: false,
  allowMethods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

app.use(koaBody({
  urlencoded: true,
  multipart: true,
}));

const tickets = [];
const ticketsFull = [];

app.use(async (ctx) => {
    const method = ctx.request.url.split('/')[1];
    let id, name, description
    
    switch (method) {
        case 'allTickets':
            ctx.response.body = JSON.stringify(tickets);
            return;
        case 'statusChanged':
            id = JSON.parse(ctx.request.body);
            tickets.forEach(item => {
              if (item.id === id) {
                if (item.status) {
                  item.status = false;
                } else {
                  item.status = true;
                }
              }
            });
            ticketsFull.forEach(item => {
              if (item.id === id) {
                if (item.status) {
                  item.status = false;
                } else {
                  item.status = true;
                }
                ctx.response.body = item.status
              }
            });
            return;
        case 'ticketById':
            id = JSON.parse(ctx.request.body)
            ctx.response.body = JSON.stringify(ticketsFull.find(item => item.id === id).description);
            return;
        case 'createNewTicket':
            name = JSON.parse(ctx.request.body).name;
            description = JSON.parse(ctx.request.body).description;

            const ticketId = performance.now();
            const ticketCreated = getCreationDate;
            const ticketStatus = false;
            
            const ticket = new Ticket(ticketId, name, ticketStatus, ticketCreated)
            const ticketFull = new TicketFull(ticketId, name, description, ticketStatus, ticketCreated);
            
            tickets.push(ticket);
            ticketsFull.push(ticketFull);
            ctx.response.body = JSON.stringify(ticket);
            return;
        case 'updateTicket':
            data = JSON.parse(ctx.request.body);

            id = Number(data.id);
          
            const updateTicket = ticketsFull.find(item => item.id === id);

            updateTicket.name = data.name;
            updateTicket.description = data.description;

            tickets.find(item => item.id === id).name = data.name;

            ctx.response.body = JSON.stringify(updateTicket);
            return;
        case 'deleteTicket':
            id = ctx.request.query.id

            const deleteTicket = tickets.splice(tickets.findIndex(item => item.id === id), 1);
            ticketsFull.splice(ticketsFull.findIndex(item => item.id === id), 1);
      
            ctx.response.body = JSON.stringify(deleteTicket);
            return; 
        default:
            ctx.response.status = 404;
            return;
    }
});

const server = http.createServer(app.callback());

const port = 7070;

server.listen(port, (err) => {
  if (err) {
    console.log(err);

    return;
  }

  console.log('Server is listening to ' + port);
});