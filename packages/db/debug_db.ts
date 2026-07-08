import { prisma } from './index';

async function main() {
  const log = await prisma.chatLog.findFirst({
    where: { sessionId: 'test_session_1' }
  });
  console.log("ChatLog entry:", log);
}

main();
