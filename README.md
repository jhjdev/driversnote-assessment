# Driversnote Assessment
A React Native Assessment for Driversnote

## The task: Extend and improve our MVP
We have built a very quick MVP with a flow to buy a single iBeacon and make an order to get it delivered. This app is attached and has the necessary boilerplate for typescript, navigation, jest tests, etc.

The app starts with selecting a customer from a list. This is obviously not the way we’d do it in a real-life scenario, but it’s done this way to easily test the flow with users from different countries and with different levels of (in)complete user-info.
The flow currently has three steps: Selecting an iBeacon, picking delivery address and showing an order confirmation. 
Here is what we would like you to do:
1.	Make it possible to buy more than one iBeacon.
a.	You need to update the UI and purchase logic to let the user specify the nr of iBeacons to buy.
b.	When a user buys more than 5 iBeacons, they get a 15% discount.
2.	Fetch the price of the iBeacon dynamically. Imagine that we are running an A/B test to expose users to different prices depending on their country. To get the correct price, two pieces of data must be queried:
a.	The "user_experiments" endpoint reveals which variant of the "beacon_price” experiment the user has been assigned.
https://6548fde7dd8ebcd4ab240284.mockapi.io/user_experiments/{user_id} 
b.	The "beacon_price" endpoint reveals the price of an iBeacon for each country / experiment variant combination.
https://633ab21ae02b9b64c6151a44.mockapi.io/api/v2/BeaconPrice
3.	Improve the architecture and code quality of the MVP app.


## Run Locally  
Clone the project  

~~~bash  
  git clone https://link-to-project
~~~

Go to the project directory  

~~~bash  
  cd my-project
~~~

Install dependencies  

~~~bash  
yarn install
~~~

Set Ruby version

~~~bash  
open .ruby-version > set ruby version to 3.3.4
~~~  

Start the server  

~~~bash  
yarn start
~~~  

<b>Run iOS</b>

~~~bash  
cd ios > pod install
~~~ 

and then

~~~bash  
cd .. > npx react-native run-ios
~~~  

<b>Run Android</b>

~~~bash  
cd android > ./gradlew clean
~~~  

and then

~~~bash  
cd .. > npx react-native run-android
~~~  

## Lessons Learned  
If you run into build issues, I recommend using the WRAP terminal
for iOS. 
It can be downloaded here https://www.warp.dev/

Enable the Sonnet AI to help you resolve any build issues with 
Pods or Gradle, as well as Ruby and Java issues. 