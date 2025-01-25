### **Postman Test Instructions**

1. **Setup Postman**:

   - Download and install Postman from [here](https://www.postman.com/).

2. **Testing the API**:

   - Create a new request in Postman and select `POST`.
   - Enter the backend URL (replace `your-backend-url.com` with the actual deployed URL):
     ```
     https://your-backend-url.com/api/data
     ```
   - Go to the **Headers** tab and add:
     - Key: `x-api-key`
     - Value: `Your_SECRET_KEY` (same as in your ESP32 code)
   - Go to the **Body** tab, select `raw`, and set the type to `JSON`.
     - Add the following JSON data:
       ```json
       {
         "temperature": 25.6,
         "humidity": 60.2,
         "dust_density": 35.7,
         "gas_level": 200
       }
       ```

3. **Send the Request**:

   - Click **Send** to test the API.

4. **Verify the Response**:
   - A successful response should return:
     ```json
     {
       "success": true,
       "message": "Data saved successfully."
     }
     ```

---

### **Notes**

- Replace `Your_SSID`, `Your_PASSWORD`, `Your_SECRET_KEY`, and `your-backend-url.com` with the actual values from your setup.
- Make sure the ESP32 is connected to the same network that can access the backend server.
- If testing locally, use the local IP address for the backend instead of a domain. For example:
  ```
  http://192.168.x.x:3000/api/data
  ```
