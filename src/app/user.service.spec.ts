import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { UtilsService } from './utils.service';
import { of } from 'rxjs';
describe('UserService', () => {
  let service: UserService;
  beforeEach(() => TestBed.configureTestingModule({
    providers: [UserService]
  }));
  afterEach(() => {
    localStorage.removeItem('token');
  });

  it('should be created', () => {
    service = TestBed.get(UserService);
    expect(service).toBeTruthy();
  });

  it('call getValue()', () => {
    service = TestBed.get(UserService);
    expect(service.getValue()).toBe('hello world');
  });

  it('call getPromiseValue()', () => {
    service = TestBed.get(UserService);
    service.getPromiseValue().then(
      value => expect(value).toBe('promise world')
    );
  });

  it('call getObservableValue()', () => {
    service = TestBed.get(UserService);
    service.getObservableValue().subscribe(
      res => expect(res).toBe('observable world')
    );
  });

  it('call showUtilsValue() with real Service', () => {
    service = new UserService(new UtilsService());
    expect(service.showUtilsValue()).toBe('Hi Rose');
  });

  it('call login()', () => {
    service = TestBed.get(UserService);
    service.login().subscribe(
      res => expect(res).toBe('v1')
    );
  });

  it('call isAuth()', () => {
    localStorage.setItem('token', '1234');
    expect(service.isAuth()).toBeTruthy();
  });
});

//create fakeService replace UtilsService
export class fakeService extends UtilsService {
  value = 'fake hi Rose';
}

describe('UserService2', () => {
  let service: UserService;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [UserService]
  }));

  it('call showUtilsValue() with fakeService', () => {
    service = new UserService(new fakeService());
    expect(service.showUtilsValue()).toBe('fake hi Rose');
  });

  it('giveValue should return faked value from fake object.', () => {
    const fake = { giveValue: () => 'fake object hello world'};
    service = new UserService(fake as UtilsService);
    expect(service.showUtilsValue()).toBe('fake object hello world');
  });

  //has error!!!
  // xit('getValue should return return value from jasmine spyObj', () => {
  //   const utilsServSpy = jasmine.createSpyObj('UtilsService', ['giveValue']);
  //   const stubValue = 'stub value';
  //   utilsServSpy.giveValue.and.returnValue(stubValue);
  //   service = new UserService(utilsServSpy);

  //   expect(service.showUtilsValue()).toBe('stub value');
  //   expect(utilsServSpy.giveValue.calls.count())
  //   .toBe(1, 'spy method was called once');
  //   expect(utilsServSpy.giveValue.calls.mostReacent().returnValue)
  //   .toBe(stubValue);
  // });
});

