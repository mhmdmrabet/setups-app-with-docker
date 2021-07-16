import { PrismaClient } from "@prisma/client";
import fastify from "fastify";

const prisma = new PrismaClient();
const server = fastify();

server.get("/api", (request, reply) => {
  reply.send({ message: "Hi, Every Body!" });
});

server.get("/api/create-counter", async (request, reply) => {
  try {
    await prisma.$connect();
    const count = await prisma.count.create({ data: {} });
    reply.send({ count });
  } catch (error) {
    console.log(error);
    reply.send({ error });
  } finally {
    await prisma.$disconnect();
  }
});

server.get("/api/count", async (request, reply) => {
  try {
    await prisma.$connect();
    const count = await prisma.count.findFirst({});
    const updateCount = await prisma.count.update({
      where: { id: count?.id },
      data: {
        count: count!.count + 1,
      },
    });

    reply.send(updateCount);
  } catch (error) {
    console.log(error);
    reply.send({ error });
  } finally {
    await prisma.$disconnect();
  }
});

server.listen(80, "0.0.0.0", (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server ready at: ${address}`);
});

process.addListener("SIGINT", () => {
  server.close((error) => {
    if(error){
      process.exit(1)
    } 
    
  })
});
