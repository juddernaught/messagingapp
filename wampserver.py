from autobahn.asyncio.wamp import ApplicationSession, ApplicationRunner

class MyComponent(ApplicationSession):
  print('here');
  def onJoin(self, details):
    print("session joined")
    counter = 0
    while True:
      self.publish('com.myapp.topic1', counter)
      counter += 1  
      # yield from asyncio.sleep(1)
    # def oncounter(count):
	   #  print("event received: {0}", count)

	   #  try:
				# yield from self.subscribe(oncounter, u'com.myapp.oncounter')
			 # 	print("subscribed to topic")
	   #  except Exception as e:
	   #    print("could not subscribe to topic: {0}".format(e))

# if __name__ == '__main__':
#   runner = ApplicationRunner(url = u"ws://localhost:8080/ws", realm = u"realm1")
#   runner.run(MyComponent)