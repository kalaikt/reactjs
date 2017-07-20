import chai from 'chai';
import { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';

import MedallionService from '../../src/js/data/medallion-service';
import Data from '../../src/js/data/data';
import Params from '../../src/js/lib/params';

chai.use(chaiAsPromised);

let deviceMockData = require('../../src/js/data/mock/device-id-mock.json');
let optionsMockData = require('../../src/js/data/mock/report-problem-mock.json');

describe('MedallionService', () => {
  def('sandbox', () => sinon.sandbox.create());
  def('subject', () => MedallionService);
  def('guestId', () => 'oceanId-9d5a50e0-7a8e-4611-8775-8ab5a583d50d');
  def('deviceId', () => 'M777-4141-0001');

  afterEach(() => {
    $sandbox.restore();
    Params.forceMockData = false;
  });

  context('deviceMockData for getDeviceId', () => {
    it('can load mock data from file when mock param set', () => {
      Params.forceMockData = true;
      let promise = MedallionService.getDeviceId($guestId);
      return expect(promise).to.eventually.deep.equal(deviceMockData);
    });
  });

  context('optionsMockData for fetchReportProblemOptions', () => {
    it('can load mock data from file when mock param set', () => {
      Params.forceMockData = true;
      let promise = MedallionService.fetchReportProblemOptions($guestId);
      return expect(promise).to.eventually.deep.equal(optionsMockData);
    });
  });

  context('server tests', () => {
    let server, fetchSpy;

    before(() => {
      server = sinon.fakeServer.create();
      server.respondImmediately = true;
      fetchSpy = sinon.spy($subject, 'handleFetch');
    });

    after(() => {
      server.restore();
    });

    context('getDeviceId', () => {
      it("calls with GET", () => {
        $sandbox.stub($subject, 'getDeviceId');
        $subject.getDeviceId($guestId);
        fetchSpy.calledWith(
          sinon.match(`${$subject.xosUrl}/users/${$guestId}/medallions`),
          { headers: { 'Content-Type': "application/json" }, method: "GET" })
      });

      it("returns service response", () => {
        server.respondWith(JSON.stringify(deviceMockData));
        return expect($subject.getDeviceId($guestId)).eventually.deep.equal(deviceMockData);
      });

      it("rejects on error", () => {
        server.respondWith([501, { "Content-Type": "text/html" }, "HTTP 501 Not Implemented"]);
        return expect($subject.getDeviceId($guestId)).to.eventually.be.rejectedWith(/HTTP 501 Not Implemented/)
      });
    });

    context('fetchReportProblemOptions', () => {
      it("calls with GET", () => {
        $sandbox.stub($subject, 'fetchReportProblemOptions');
        $subject.fetchReportProblemOptions($guestId);
        fetchSpy.calledWith(
          sinon.match(`${$subject.xosUrl}/medallions/${$guestId}/problems`),
          { headers: { 'Content-Type': "application/json" }, method: "GET" })
      });

      it("returns service response", () => {
        server.respondWith(JSON.stringify(optionsMockData));
        return expect($subject.fetchReportProblemOptions($guestId)).eventually.deep.equal(optionsMockData);
      });

      it("rejects on error", () => {
        server.respondWith([501, { "Content-Type": "text/html" }, "HTTP 501 Not Implemented"]);
        return expect($subject.fetchReportProblemOptions($guestId)).to.eventually.be.rejectedWith(/HTTP 501 Not Implemented/)
      });

    });

    context('sendReportProblem', () => {
      const data = {'problem-type': 'My stateroom won\'t unlock', 'other-text': ''}

      it("calls with PUT", () => {
        $sandbox.stub($subject, 'sendReportProblem');
        $subject.sendReportProblem(data, $deviceId);
        fetchSpy.calledWith(
          sinon.match(`${$subject.xosUrl}/medallions/${$deviceId}/problemreport`),
          { headers: { 'Content-Type': "application/json" }, method: "PUT" })
      });

      it("returns service response", () => {
        server.respondWith(JSON.stringify(data));
        return expect($subject.sendReportProblem(data, $deviceId)).eventually.deep.equal(data);
      });

      it("rejects on error", () => {
        server.respondWith([501, { "Content-Type": "text/html" }, "HTTP 501 Not Implemented"]);
        return expect($subject.sendReportProblem(data, $deviceId)).to.eventually.be.rejectedWith(/HTTP 501 Not Implemented/)
      });

    });
  });
});
