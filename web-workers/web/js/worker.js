'use strict';

var curNum = 0;

// Add an event listener for messages, when a message is received, call onMessage
self.onmessage = onMessage;

// self.postMessage('Hello from worker.js!');

// **********************************

function onMessage() {
  getNextFib();
}

function getNextFib() {
  var curFib = fib(curNum);
  self.postMessage({ num: curNum, fib: curFib });
  curNum++;
  getNextFib();
}

function fib(n) {
  if (n < 2) {
    return n;
  }
  return fib(n - 1) + fib(n - 2);
}
