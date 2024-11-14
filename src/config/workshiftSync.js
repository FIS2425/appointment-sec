import Workshift from '../schemas/Workshift.js';

export async function processWorkshiftMessage(msg) {
  const obj = JSON.parse(msg.content.toString());
  switch (obj.event) {
  case 'workshift-sync':
    await syncWorkshifts(obj.workshifts);
    break;
  case 'workshift-created':
    await createWorkshiftView(obj.workshift);
    break;
  case 'workshift-updated':
    await updateWorkshiftView(obj.workshift);
    break;
  case 'workshift-deleted':
    await deleteWorkshiftView(obj.workshift);
    break;
  case 'workshifts-many':
    await createManyWorkshifts(obj.workshifts);
    break;
  default:
    console.error('Unknown event type:', obj.event);
  }
}

export async function createWorkshiftView(workshiftData) {
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
}