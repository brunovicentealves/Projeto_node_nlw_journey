import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import {z} from 'zod';
import{prisma} from "../lib/prisma"
import dayjs from "dayjs";
import { error } from "console";
import { getMailClient } from "../lib/mail";
import nodemailer from 'nodemailer';

export async function createTrip(app:FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/trips',{
    schema:{
      body:z.object({
        destination:z.string().min(4),
        starts_at:z.coerce.date(),
        end_at:z.coerce.date(),
        owner_name:z.string(),
        owner_email:z.string().email(),
        owner_to_invite: z.array(z.string().email())

      })
    },
  },async(request)=>{
    const{destination,starts_at,end_at,owner_name,owner_email} = request.body;

    if(dayjs(starts_at).isBefore(new Date)){
      throw new Error("Invalid trip start Date!");
    }

    if(dayjs(end_at).isBefore(starts_at)){
      throw new Error("Invalid trip End Date!")
    }


    const trip = await prisma.trip.create({
      data:{
        destination,
        starts_at,
        end_at,
        participants:{
          create:{
            name:owner_name,
            email:owner_email,
            is_confirmed:true,
            is_owner:true

          }
        }
      }
    })
    
const mail = await getMailClient();

const message = await mail.sendMail({

  from: {
    name: "Equipe plann.er",
    address: "oi@plann.er"
  },
  to: {
    name:owner_name,
    address:owner_email
  },
  subject: "Testando envio de email",
  html: `<h1>Teste de envio de email</h1>`
  })

  console.log(nodemailer.getTestMessageUrl(message))

    return {
      tripId: trip.id
    }
  })
}