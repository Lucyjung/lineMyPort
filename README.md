#Line My Port
There are 2 major part for this repository 
1. Backend Web Service
- Using Node js with Hapi framework to provide web service for personal wealth management 
- Connect to firestore for database 
- Use 3rd party web service to get Stock and Fund information 
    => Mandatory : get NAV or latest stock price 
    => To automatic collect dividend information calculate base on purchase date  (TODO)
2. Line Front end 
- Web Interface wiht Line Application (Using LIFF)
- Able to draw graph for summary report 