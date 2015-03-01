###############################################################################
##
##  Copyright (C) 2014, Tavendo GmbH and/or collaborators. All rights reserved.
##
##  Redistribution and use in source and binary forms, with or without
##  modification, are permitted provided that the following conditions are met:
##
##  1. Redistributions of source code must retain the above copyright notice,
##     this list of conditions and the following disclaimer.
##
##  2. Redistributions in binary form must reproduce the above copyright notice,
##     this list of conditions and the following disclaimer in the documentation
##     and/or other materials provided with the distribution.
##
##  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
##  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
##  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
##  ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
##  LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
##  CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
##  SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
##  INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
##  CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
##  ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
##  POSSIBILITY OF SUCH DAMAGE.
##
###############################################################################

from twisted.internet.defer import inlineCallbacks

from autobahn.twisted.util import sleep
from autobahn.twisted.wamp import ApplicationSession
from autobahn.wamp.exception import ApplicationError
import sys
import redis



class AppSession(ApplicationSession):

    @inlineCallbacks
    def onJoin(self, details):
        # r = redis.StrictRedis(host='localhost', port=6379, db=0)
        redis_url = os.getenv('REDISTOGO_URL', 'redis://localhost:6379')
        r = redis.StrictRedis.from_url(redis_url)
        # when a message is printed, save it        
        def onMessage(msg):
            print("event for 'onhello' received: {}".format(msg))
            sys.stdout.flush()
            r.rpush('messages', msg)

        # add functionality to only get last 15 messages
        def getMessages():
            # get the list
            messages = r.lrange('messages', 0, -1)
            return messages

        sub = yield self.subscribe(onMessage, 'com.myapp.topic1')
        print("subscribed to topic 'onhello'")
        sys.stdout.flush()


        # ## REGISTER a procedure for remote calling
        reg = yield self.register(getMessages, 'com.myapp.getMessages')
        print("procedure getMessages() registered")
        sys.stdout.flush()

