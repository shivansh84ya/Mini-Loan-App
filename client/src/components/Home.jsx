import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../App";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Home = () => {
  const [loans, setLoans] = useState([]);
  const { user, token, setLoggedIn, setUser } = useContext(AuthContext);
  const [showDetails, updateShowDetails] = useState("-1");
  const navigate = useNavigate();

  const fetchLoans = async () => {
    try {
      const loanData = await axios.get(
        "http://localhost:5000/api/v1/loans",
        {
          headers: {
            "Content-Type": "application/json",
            bearertoken: token,
          },
        }
      );
      const loansWithInitializedAdditionalAmount = loanData.data.Loans.map(loan => {
        return {
          ...loan,
          repayments: loan.repayments.map(repayment => {
            return {
              ...repayment,
              additionalAmount: 0
            };
          })
        };
      });
      setLoans(loansWithInitializedAdditionalAmount);
    } catch (err) {
      toast.error(`Can't fetch the loans\nError: ${err}`);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/v1/loans/update-status/`,
        { id, status },
        {
          headers: {
            "Content-Type": "application/json",
            bearertoken: token,
          },
        }
      );
      toast.success("Updated the loan status");
      window.location.reload(false);
      navigate("/");
    } catch (error) {
      toast.error(`Can't update status!`);
    }
  };
  const updatePayment = async (loanId, installmentId, additionalAmount) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/v1/loans/repay/`,
        { loanId, installmentId, additionalAmount },
        {
          headers: {
            "Content-Type": "application/json",
            bearertoken: token,
          },
        }
      );
      toast.success("Paid the installment");
      fetchLoans();
    } catch (error) {
      toast.error(`Can't pay installment!`);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/loans/delete/${id}`, {
        headers: {
          "Content-Type": "application/json",
          bearertoken: token,
        },
      });
      toast.success("Loan deleted successfully");
      fetchLoans();
    } catch (error) {
      toast.error(`Can't delete loan!\nError:${error}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  return (
    <div className="container mx-auto p-4">
      {user && (
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-blue-800">Welcome {user.name}</h3>
            <p className="text-gray-600">Email: {user.email}</p>
          </div>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}

    

      {loans.length ? (
        <table className="w-full border-collapse border border-gray-300 mt-4">
          <thead>
            <tr className="bg-blue-500 text-white">
              {user.user_type === "admin" && <th className="py-2">User ID</th>}
              {user.user_type === "admin" && <th className="py-2">Name</th>}
              {user.user_type === "admin" && <th className="py-2">Email</th>}
              <th className="py-2">Amount</th>
              <th className="py-2">Terms</th>
              <th className="py-2">Status</th>
              <th className="py-2">Created Date</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan, idx) => (
              <React.Fragment key={idx}>
                <tr className={idx % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                  {user.user_type === "admin" && <td className="py-2">{loan.user_id._id}</td>}
                  {user.user_type === "admin" && <td className="py-2">{loan.user_id.name}</td>}
                  {user.user_type === "admin" && <td className="py-2">{loan.user_id.email}</td>}
                  <td className="py-2">{loan.amount}</td>
                  <td className="py-2">{loan.terms}</td>
                  <td className="py-2">{loan.status}</td>
                  <td className="py-2">{loan.createdAt.slice(0, 10)}</td>
                  <td className="py-2">
                    {user && user.user_type === "admin" && loan.status === "pending" ? (
                      <>
                        <button
                          className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                          onClick={() => updateStatus(loan._id, "accepted")}
                        >
                          Accept
                        </button>
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded"
                          onClick={() => updateStatus(loan._id, "rejected")}
                        >
                          Reject
                        </button>
                      </>
                    ) : loan.status !== "rejected" ? (
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                        onClick={() => updateShowDetails(loan._id)}
                      >
                        View Details
                      </button>
                    ) : (
                      <button className="bg-gray-300 text-gray-600 px-3 py-1 rounded" disabled>
                        Rejected :(
                      </button>
                    )}
                  </td>
                  {user.user_type === "admin" && (
                    <td className="py-2">
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded"
                        onClick={() => handleDelete(loan._id)}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
                {showDetails === loan._id && (
                  <tr className="bg-gray-200">
                    <td colSpan={user.user_type === "admin" ? 8 : 7} className="p-4">
                      <h2 className="text-lg font-semibold">Loan Details:</h2>
                      <p>Total Amount: {loan.amount}</p>
                      <p>Remaining Amount: {loan.remainingAmount}</p>
                      <table className="mt-4 w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-blue-500 text-white">
                            <th className="py-2">Amount</th>
                            <th className="py-2">Due</th>
                            <th className="py-2">Status</th>
                            <th className="py-2">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loan.repayments.map((repay, index) => (
                            <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                              <td className="py-2">
                                {parseFloat(repay.amount) + (repay.additionalAmount || 0)}
                              </td>
                              <td className="py-2">{repay.date.slice(0, 15)}</td>
                              <td className="py-2">{repay.status}</td>
                              <td className="py-2">
                                {repay.status === "pending" && (
                                  <div>
                                    <input
                                      type="number"
                                      placeholder="Enter additional amount"
                                      onChange={(e) => {
                                        const additionalAmount = parseFloat(e.target.value) || 0;
                                        const updatedRepayments = [...loan.repayments];
                                        updatedRepayments[index].additionalAmount = additionalAmount;
                                        setLoans((prevLoans) => {
                                          const updatedLoans = [...prevLoans];
                                          updatedLoans[idx].repayments = updatedRepayments;
                                          return updatedLoans;
                                        });
                                      }}
                                      className="border border-gray-300 rounded px-2 py-1 mr-2"
                                    />
                                    <button
                                      disabled={loan.status !== "accepted"}
                                      onClick={() => updatePayment(loan._id, repay._id, repay.additionalAmount)}
                                      className="bg-green-500 text-white px-3 py-1 rounded"
                                    >
                                      Repay
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center mt-4">No loans found!</p>
      )}
      {user && user.user_type !== "admin" && (
        <a href="/createLoan" className="text-blue-500 hover:underline mb-4 block">
          Create New Loan +
        </a>
      )}
    </div>
  );
};

export default Home;
