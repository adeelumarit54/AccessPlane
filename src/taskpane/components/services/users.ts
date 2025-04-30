// userService.ts

export interface UserData {
    ID: string;
    Forenames: string;
    Surname: string;
    Email: string;
    Mobile: string;
    MainCompanyName: string;
    Status: string;
  }
  
  export async function GETUser(tokens) {
    // console.log("Tokens:", tokens);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append(
      "Authorization",
      "Bearer "+ tokens.access_token
    );
  
    const requestOptions: RequestInit = {
      method: "GET",
      headers: myHeaders,
    };
  
    try {
      const response = await fetch(
        "https://outlookdemo.accessplanit.com/accessplansandbox/api/v2/user",
        requestOptions
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
  