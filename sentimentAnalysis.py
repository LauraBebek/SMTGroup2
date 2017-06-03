import numpy as np

def readLexicon(positive_file, negative_file):
    
    f_pos = open(positive_file, 'r') 
    positive_lex = f_pos.read().splitlines()
    f_neg = open(negative_file, 'r')
    negative_lex = f_neg.read().splitlines()

    return positive_lex, negative_lex

def classifyTweet(content_tweet, positive_lex, negative_lex):
	
	#calculate positive and negative words
	sum = 0
	sum_not_classified = 0
	for word in content_tweet:
		if word in positive_lex:
			sum += 1
		elif word in negative_lex:
			sum -= 1
		else:
			sum_not_classified +=1 
			
	
	word_count = len(content_tweet)	 #content_tweet.split() for text instead of list
	# initially (word_count - sum) -> but ends up always positive
	if (word_count - sum - sum_not_classified) > 0 :
		result = "positive"
	elif (word_count - sum - sum_not_classified) < 0 :
		result = "negative"
	else:
		result = "neutral"
	
	print "word_count (", word_count, " and sum: ", sum
	return result

def main():
    positive_lex, negative_lex = readLexicon("sentimentLexicon/positive-words.txt", "sentimentLexicon/negative-words.txt");
    #test
    tweet1 = ['appreciate', 'what', 'is', 'going on']
    tweet2 = ['disappoint', 'decision', 'not', 'good']
    tweet3 = ['hate', 'fuck', 'pissed']

    result1 = classifyTweet(tweet1, positive_lex, negative_lex)
    result2 = classifyTweet(tweet2, positive_lex, negative_lex)
    result3 = classifyTweet(tweet3, positive_lex, negative_lex)
	
    print "tweet1 (", tweet1, ") is ", result1
    print "tweet2 (", tweet2, ") is ", result2
    print "tweet3 (", tweet3, ") is ", result3

if __name__ == '__main__':
    main()
