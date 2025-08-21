import ExpenseAnalytics from "../components/chart";
import ExpenseForm from "../components/ExpenseFORM.JSX";


function Dashboard() {
  return (<>
  <ExpenseForm></ExpenseForm>
  <ExpenseAnalytics/>
  </>
    
  );
}

export default Dashboard;