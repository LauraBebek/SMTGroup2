import tweepy
import json
import jsonpickle
import time
from tweepy import OAuthHandler
from tweepy import AppAuthHandler

consumer_key = 'ieT98eFBrLnoG6RywyX7CJPtx'
consumer_secret = 'Aa2Qeh0SizNPFSx1Mf4ICquI908MOfmwhoRAP5LoX5tdUqkhPo'
access_token = '870921166382411776-djzRR0zs811bcl7yCgxdUavzf6Gwxoc'
access_secret = 'HvxcjUwI5G78Z70VMdTqXlA2SGzh5igfj6zsRPfP2WnAF'

#auth = OAuthHandler(consumer_key, consumer_secret)
#auth.set_access_token(access_token, access_secret)

auth = AppAuthHandler(consumer_key, consumer_secret)

api = tweepy.API(auth, wait_on_rate_limit=True, wait_on_rate_limit_notify=True)

error_sleep = 10

searchQuery = '@realdonaldtrump'
retweet_filter=' -filter:retweets'
q=searchQuery+retweet_filter
tweetsPerQry = 100

fileName = 'tweets.txt'

max_id = -1L
sinceId = None
maxTweets = 100000

tweetCount = 0
print("Downloading max {0} tweets".format(maxTweets))
with open(fileName, 'w') as f:
    f.write("[")
    while tweetCount < maxTweets:
        try:
            if (max_id <= 0):
                if (not sinceId):
                    new_tweets = api.search(q=searchQuery, count=tweetsPerQry)
                else:
                    new_tweets = api.search(q=searchQuery, count=tweetsPerQry,  since_id=sinceId)
            else:
                if (not sinceId):
                    new_tweets = api.search(q=searchQuery, count=tweetsPerQry, max_id=str(max_id - 1))
                else:
                    new_tweets = api.search(q=searchQuery, count=tweetsPerQry, max_id=str(max_id - 1), since_id=sinceId)
            if not new_tweets:
                print("No more tweets found")
                break

            for tweet in new_tweets:
                if (not tweet.retweeted) and ('RT @' not in tweet.text): # if not retweeted

                    user = tweet._json['user']

                    del tweet._json['user']
                    del tweet._json['entities']
                    del tweet._json['metadata']

                    user_light = {}
                    user_light['id'] = user['id']
                    user_light['location'] = user['location']
                    user_light['friends_count'] = user['friends_count']
                    user_light['favourites_count'] = user['favourites_count']
                    user_light['followers_count'] = user['followers_count']
                    user_light['statuses_count'] = user['statuses_count']
                    user_light['name'] = user['name']

                    tweet._json['user'] = user_light

                    f.write(jsonpickle.encode(tweet._json, unpicklable=False) + ',')

            tweetCount += len(new_tweets)
            print("Downloaded {0} tweets".format(tweetCount))
            max_id = new_tweets[-1].id
        except tweepy.TweepError as e:
            # Just exit if any error
            print("some error : " + str(e) + " sleeping for {0} seconds".format(error_sleep))
            time.sleep(error_sleep)

    f.write("]")

print ("Downloaded {0} tweets, Saved to {1}".format(tweetCount, fileName))

#tweets = api.user_timeline(screen_name = user,count=10)

#for tweet in tweets:
    # Process a single status
 #   if (not tweet.retweeted) and ('RT @' not in tweet.text): # if not retweeted
  #      print(tweet)

   #     retweets = api.retweets(tweet.id)

        #for retweet in retweets:
            #print(retweet.text)
