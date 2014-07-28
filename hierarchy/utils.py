class NumConv(object):

    def __init__(self, alphabet='0123456789'):
        self.alphabet = alphabet
        self.alphabet_dict = dict(zip(alphabet, range(len(alphabet))))

    def num2str(self, num, length=1):
        alphabet = self.alphabet
        radix = len(alphabet)
        s = ''
        while num > 0:
            num, remainder = divmod(num, radix)
            s = alphabet[remainder] + s
        return (length - len(s)) * alphabet[0] + s

    def str2num(self, s):
        radix = len(self.alphabet)
        alphabet_dict = self.alphabet_dict
        num = 0
        for char in s:
            num = num * radix + alphabet_dict[char]
        return num


