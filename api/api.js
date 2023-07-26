import axios from "axios";
const baseURL = "http://localhost:3030/rate"; 

const getBranches = async () => {
  return axios({
    url: "get-branches",
    baseURL,
    method: "GET",
  })
  .then((response) => {
    return response.data;
  })
  .catch((err) => {
    return {
      status: "falid",
      msg: "خطا اتصال"
    }
  });
};

const sendCustomerInfo = async(userName, phoneNo, branch, serviceLevelValue) => {
  const data = {
    userName, 
    phoneNo, 
    branch, 
    serviceLevelValue
  }
  return axios({
    url: "send-customer-info",
    baseURL,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data:JSON.stringify(data)
  })
  .then((response) => {
    return response.data;
  })
  .catch((err) => {
    return {
      status: "falid",
      msg: "خطا اتصال"
    }
  });
}

export { getBranches,sendCustomerInfo };
