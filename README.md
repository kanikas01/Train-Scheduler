# Train-Scheduler

This web page allows users to add train lines to a master train schedule.  The user adds the train name, destination, time of first journey and train frequency.  This info is added to a firebase database (as well as the page itself), and subsequently the next arrival time and minutes to next arrival are calculated for each train line. User input is checked against a series of regular expressions which serve to verify that train data is being input in an appropriate format.

The page uses the Bootstrap framework, and is best viewed on screens that are tablet-sized or larger.