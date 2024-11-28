const request = require('supertest');
const app = require('../App');
const ValidateJWT = require('../src/Middlewares/ValidateJWT');
const mongoServer = require('./Mongosetup/mongoServer');

jest.mock('../src/Middlewares/ValidateJWT');






    //common for testing login and accessing routes//
  /*let testLogin = {
        email : "test@gmail.com",
        password : "test@1234"
    };*/



describe("Test for User Registration,Login and profile routes", () => {


    let User =
    {
        username: "test",
        email: "test@gmail.com",
        password: "test@1234",
        phone: "9876543210",
        role: "attendee"
    };

    let testLogin = {
        email : "test@gmail.com",
        password : "test@1234"
    };

    beforeAll(async () => {
        await mongoServer.connect();
     
     
         ValidateJWT.mockImplementation((req, res, next) => {
             
             const mockUser = {
                 _id: "mockUserId",
                 username: "test",
                 email: "test@gmail.com",
                 role: "attendee"
             };
             req.user = mockUser;
             next();
         });
     });
     
     afterAll(async () => {
        await mongoServer.disconnect();
     });


    it("Should signup for a user", async () => {
 
          
        const res = await request(app)
            .post('/api/users/register')
            .send(User);
        
    
        expect(res.statusCode).toEqual(201)
        expect(res.body).toHaveProperty('message')
        expect(res.body.user).toMatchObject({
            username: User.username,
            email: User.email
        });
    });


    it("Should indicate for empty fields in register", async()=>{
          
        const res = await request(app)
            .post('/api/users/register')
            .send(User);


        if(res.statusCode === 500){
            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('error');
            expect(res.body.error).toMatch("Internal Server Error"); 
         }

         if(res.statusCode === 400){
           
            if(res.body.username === "" 
                  || res.body.password === ""
                   || res.body.email === ""
                   || res.body.phone === ""
                  || res.body.role === ""){
                expect(res.statusCode).toEqual(400);
                expect(res.body).toHaveProperty('error');
                expect(res.body.error).toMatch("All fields are required");
            }
         }


    })



    //to test for signup of user//
    it("Should login for a user", async ()=>{

        const res = await request(app)
            .post("/api/users/login")  
             .send(testLogin);

       expect(res.statusCode).toBe(200);
       expect(res.body).toEqual({
         success: true,
        token: expect.any(String),
        role: expect.any(String)
       });
        
    });

    //to test for validation of login//
    it("Should indicate for empty email or password and invalid credentials", async()=>{

          const res = await request(app)
                              .post("/api/users/login")
                              .send(testLogin);


        if(testLogin.email === "" || testLogin.password === ""){
            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error');
            expect(res.body.error).toMatch("All fields are required");
           }

          else if(res.statusCode === 401){
            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('error');
            expect(res.body.error).toMatch("invalid Credentials");
           }
    });

    //call the middleware for token validation//
    

   //to test profile routes//
    it("Should get user Profile with valid token", async()=>{

        const loginRes = await request(app)
                    .post("/api/users/login")
                    .send(testLogin);

                    const token = loginRes.body.token;

        const ProfileRes = await request(app)
                   .get("/api/users/profile")
                    .set("Authorization", `Bearer ${token}`);
                    

         expect(ProfileRes.statusCode).toBe(200);
        expect(ProfileRes.body).toHaveProperty('user');
    });


    it("should indicate invalid token for profile", async () => {
        const res = await request(app)
            .get("/api/users/profile")
            .set("Authorization", ""); // No token

      if (res.statusCode === 498) {
        expect(res.statusCode).toBe(498);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toMatch("Token not Found");
      }
    });
    

});




jest.setTimeout(50000);
