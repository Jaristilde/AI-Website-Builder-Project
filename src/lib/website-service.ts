import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { BusinessData, WizardStep, PublishState } from '../types/builder';

export interface WebsiteDocument {
  businessData: BusinessData;
  name: string;
  wizardStep: WizardStep;
  publishState: PublishState;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface WebsiteListItem extends WebsiteDocument {
  id: string;
}

function websitesCol(userId: string) {
  return collection(db, 'users', userId, 'websites');
}

function websiteDoc(userId: string, websiteId: string) {
  return doc(db, 'users', userId, 'websites', websiteId);
}

export async function listWebsites(userId: string): Promise<WebsiteListItem[]> {
  const q = query(websitesCol(userId), orderBy('updatedAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as WebsiteDocument),
  }));
}

export async function getWebsite(
  userId: string,
  websiteId: string
): Promise<WebsiteListItem | null> {
  const snap = await getDoc(websiteDoc(userId, websiteId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as WebsiteDocument) };
}

export async function createWebsite(
  userId: string,
  businessData: BusinessData,
  step: WizardStep
): Promise<string> {
  const docRef = await addDoc(websitesCol(userId), {
    businessData,
    name: businessData.businessName || 'Untitled Website',
    wizardStep: step,
    publishState: { isPublished: false, slug: null, publishToken: null, url: null },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function saveWebsite(
  userId: string,
  websiteId: string,
  businessData: BusinessData,
  step: WizardStep
): Promise<void> {
  await updateDoc(websiteDoc(userId, websiteId), {
    businessData,
    name: businessData.businessName || 'Untitled Website',
    wizardStep: step,
    updatedAt: serverTimestamp(),
  });
}

export async function updatePublishState(
  userId: string,
  websiteId: string,
  publishState: PublishState
): Promise<void> {
  await updateDoc(websiteDoc(userId, websiteId), {
    publishState,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteWebsite(
  userId: string,
  websiteId: string
): Promise<void> {
  await deleteDoc(websiteDoc(userId, websiteId));
}
