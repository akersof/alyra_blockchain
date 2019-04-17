import sys

def isPalindrome(string):
    string = "".join(string.split(" "))
    if len(string) == 0 or len(string) == 1:
        return True
    elif string[0] != string[len(string) - 1]:
        return False
    else:
        return isPalindrome(string[1:-1])


# test isPalindrome ont he command line
string = sys.argv[1]
if isPalindrome(string):
    print (f'{string} is a palindrome.')
else:
    print (f'{string} is NOT a palindrome.')
