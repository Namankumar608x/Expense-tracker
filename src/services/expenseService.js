import { collection, 
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp 
  
} from 'firebase/firestore';
import {db} from '../firebase.js'
import { doc } from 'firebase/firestore';


const addExpense=async (expenseData)=>{
           try{
            const docRef=await addDoc(collection(db,'expenses'),{
                ...expenseData,
                createdAt:serverTimestamp(),
                updatedAt:serverTimestamp(),
            });
            return {success:true,id:docRef.id};
           }catch(error){
            console.log('error adding expense',error);
            return {success:false,error:error.message};
           }
}
const getUserExpenses = async (userId) => {
  try {
    const q = query(
      collection(db, 'expenses'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const expenses = [];
    querySnapshot.forEach((doc) => {
      expenses.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return { success: true, data: expenses };
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return { success: false, error: error.message };
  }
};
const updateExpense = async (expenseId, updates) => {
  try {
    const expenseRef = doc(db, 'expenses', expenseId);
    await updateDoc(expenseRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating expense:', error);
    return { success: false, error: error.message };
  }
};
const deleteExpense = async (expenseId) => {
  try {
    await deleteDoc(doc(db, 'expenses', expenseId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting expense:', error);
    return { success: false, error: error.message };
  }
};
export {addExpense,getUserExpenses ,updateExpense,deleteExpense   };