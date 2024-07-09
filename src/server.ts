import fastify from "fastify";
import { prisma } from "./lib/prisma";

const app  = fastify();


app.get('/cadastrar',async()=>{
 await prisma.trip.create({
    data:{
      destination:'Florianopolis',
      starts_at: new Date(),
      end_at: new Date(),
    },
  })

  return 'Registro Cadastrado com sucesso!'
})

app.get('/listar',async()=>{
  const trips = await prisma.trip.findMany()

  return trips
})

app.get('/teste',()=>{
  return "Hello Word";
})

app.listen({port:3333}).then(()=>{
 console.log('Server Running!'); 
})