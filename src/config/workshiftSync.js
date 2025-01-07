import Workshift from '../schemas/Workshift.js';

export async function processWorkshiftMessage(msg) {
  const obj = JSON.parse(msg.content.toString());
  console.log(`[RabbitMQ] Received message with length: ${obj.length} and event: ${msg.fields.routingKey}`);
  switch (msg.fields.routingKey) {
  case 'workshift-sync':
    await syncWorkshifts(obj);
    break;
  case 'workshift-created':
    await createWorkshiftView(obj);
    break;
  case 'workshift-updated':
    await updateWorkshiftView(obj);
    break;  
  case 'workshift-deleted':
    await deleteWorkshiftView(obj);
    break;
  case 'workshifts-many':
    await createManyWorkshifts(obj);
    break;
  default:
    console.error('Unknown event type:', obj.event);
  }
}

export async function createWorkshiftView(workshiftData) {
  const existingWorkshift = await Workshift.findById(workshiftData._id);
  if (existingWorkshift) {
    console.log('Workshift already exists, not saving');
    return;
  }
  const workshift = new Workshift(workshiftData);
  await workshift.save();
}

export async function updateWorkshiftView(workshiftData) {
  await Workshift.findByIdAndUpdate(workshiftData._id, workshiftData);
}

export async function deleteWorkshiftView(workshiftData) {
  await Workshift.findByIdAndDelete(workshiftData._id);
}

export async function createManyWorkshifts(workshifts) {
  await Workshift.insertMany(workshifts);
}


export async function syncWorkshifts(workshifts) {
  await Workshift.deleteMany({});
  await Workshift.insertMany(workshifts);
  console.log('[RabbitMQ] Workshifts synchronized');
}