# multiSig
This repository contains the optimized version of multiSig project.
**Note:- Middleware to verifyToken has been created and used only on 1 route i.e. Get Process By Id, for convinence of testing.
**We can still add it on all the routes without making any changes.

# Models:- 
1. Users
2. SignOff
3. Process


# APIs:-
1. Login
2. Register
3. Create Process
4. Get Process
5. Get Process By Id – gets the details of the project including the number of signOffs and will view the comment only if you are allowed by the creator, else will view other details.
6. Comments Visible to
7. Invite user to SignOff
8. SignOff a process
9. Get All Users
10. Get User By Id
11. Accept/Rejet a SignOff


# Utils:- 
1. sendMail – To send email.
2. generateRandomLoginId - To generate a random login Id.
3. addOwner - Add the owner to the commentsVisibleTo list.

# Middlewares:-
1. verifyToken - To verfy the token of a user.
2. permission - To check for the persmission of a user, if he/she has been allowed by the creator to view the comments or not.
