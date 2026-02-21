// All Firestore database functions in one place

import {
  collection, addDoc, getDocs, deleteDoc,
  doc, updateDoc, serverTimestamp, orderBy, query
} from 'firebase/firestore';
import { db } from './config';

// ── fetch all documents from a collection (newest first) ──
export async function getAll(col) {
  try {
    const snap = await getDocs(query(collection(db, col), orderBy('createdAt', 'desc')));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch {
    // fallback if Firestore index isn't ready yet
    const snap = await getDocs(collection(db, col));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }
}

// ── add a new product ──
export async function addProduct(data) {
  return addDoc(collection(db, 'products'), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

// ── delete a product ──
export async function deleteProduct(id) {
  return deleteDoc(doc(db, 'products', id));
}

// ── toggle in-stock status ──
export async function updateProductStock(id, inStock) {
  return updateDoc(doc(db, 'products', id), { inStock });
}

// ── place a new order ──
export async function placeOrder(orderData) {
  return addDoc(collection(db, 'orders'), {
    ...orderData,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
}

// ── update order status ──
export async function updateOrderStatus(id, status) {
  return updateDoc(doc(db, 'orders', id), { status });
}
