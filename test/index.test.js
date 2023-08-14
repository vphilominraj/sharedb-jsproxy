'use strict';

const Debug			= require('debug');
const debug			= new Debug('sharedb-jsproxy:test');
const sharedbDebug	= new Debug('sharedb-jsproxy:sharedb');

const expect	= require('chai').expect;

const logger = {
  info: sharedbDebug,
  warn: sharedbDebug,
  error: sharedbDebug
};

const ShareDB	= require('sharedb');
ShareDB.logger.setMethods(logger);

const Backend	= ShareDB.Backend;

const ShareDBPromises	= require('../util/sharedb-promises.js');
const ShareDBJSProxy	= require('../index.js');

describe('ShareDB JS Proxy', function() {
	beforeEach(async function() {
		const self = this;

		self.backend = new Backend();
		self.connection = self.backend.connect();
		self.connection.debug = sharedbDebug.enabled;
		self.doc = self.connection.get('dogs', 'fido');
		await ShareDBPromises.create(self.doc, {name: 'fido'});
	});

	it('should create a proxy to a document', function () {
		const docProxy = new ShareDBJSProxy(this.doc);
	});

	it('should update top level string field', async function () {
		const docProxy = new ShareDBJSProxy(this.doc);
		docProxy.name = 'fido';
		await docProxy.name;
		debug(this.doc);
		expect(this.doc.data.name).equal('fido');
	});

	it('should create 2 proxies to the same document', function () {
		const docProxy = new ShareDBJSProxy(this.doc);
		const doc2 = this.connection.get('dogs', 'fido');
		const doc2Proxy = new ShareDBJSProxy(doc2);
	});
});
