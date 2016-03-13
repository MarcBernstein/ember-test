import Ember from 'ember';

export default Ember.Controller.extend({

  emailAddress: '',
  message: '',

  emailisValid: Ember.computed.match('emailAddress', /^.+@.+\..+$/),
  messageIsValid: Ember.computed.gte('message.length', 5),
  isValid: Ember.computed.and('emailisValid', 'messageIsValid'),
  isDisabled: Ember.computed.not('isValid'),

  actions: {

    sendMessage() {
      this.set('responseMessage', `Thank you! We've just received your message from: ${this.get('emailAddress')}`);
      this.set('emailAddress', '');
      this.set('message', '');
    }
  }

});
