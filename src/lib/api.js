/// Check if user has an account on load
/// Return true if a given public key exists
// export const fetchAccount = async (publicKey) => {
//     // Send a GET request with the public key as a parameter
//     const response = await fetch(`../api/users?pubKey=${publicKey.toString()}`);

//     if (response.status === 200) {
//         const json = await response.json();

//         // If account is not empty
//         if (json.length > 0) {
//             // Check if there any records with this public key
//             const account = json.find((user) => user.pubKey === publicKey.toString());
//             if (account) {
//                 console.log("Current wallet's info:", json)
//                 return json
//             }
//         }
//     }
//     return null;
// }