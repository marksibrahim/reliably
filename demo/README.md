# Our Stunning Demo
Python 3.6.2 used in development

In order to run demo backend you need to initiate a cronjob:

To write to DB every 5 minutes, run the following:
`crontab -e`
`*/5 * * * * [python path] [path to demo directory]/main.py`
