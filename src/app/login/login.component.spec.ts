import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { DebugElement } from '@angular/core';
describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let service: UserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [ReactiveFormsModule],
      providers: [UserService] // for isAuth() test
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    service = TestBed.get(UserService); // for isAuth() test
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.removeItem('token');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // 使用真實的 isAuthenticated
  it('should login failed when user is not authenticated', () => {
    expect(service.isAuth()).toBeFalsy();
  });

  // 使用真實的 isAuthenticated
  it('should login success when token object exist.', () => {
    localStorage.setItem('token', '12345');
    expect(service.isAuth()).toBeTruthy();
  });
});

// --- Mocking with fake Class ---
class MockUserService {
  auth = false;
  isAuth(): boolean {
    return this.auth;
  }
}

describe('LoginComponent with mock', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let service: MockUserService;

  beforeEach(async() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule],
      providers: [MockUserService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    service = TestBed.get(MockUserService);
    fixture.detectChanges();
  });

  it('should be create.', () => {
    expect(component).toBeTruthy();
  });

  it('should login failed when user is not authenticated', () => {
    service.auth = false;
    expect(service.isAuth()).toBeFalsy();
  });

  it('should login success when user is authenticated', () => {
    service.auth = true;
    expect(service.isAuth()).toBeTruthy();
  });
});

// --- mocking with real service with Spy ---
describe('Login Component with Spy.', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let service: UserService;               // for isAuthenticated test
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule],     // for Reactive Form
      providers: [UserService]            // for isAuthenticated
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    service = TestBed.get(UserService);     // for isAuthenticated test
    fixture.detectChanges();
  });

  it('should login success when user is authenticated', () => {
    // spyOn
    spyOn(service, 'isAuth').and.returnValue(true);
    expect(service.isAuth()).toBeTruthy();
  });

  it('should login failed when user is not authenticated', () => {
    // spyOn
    spyOn(service, 'isAuth').and.returnValue(false);
    expect(service.isAuth()).toBeFalsy();
  });
});

// detect change
describe('LoginComponent login', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let service: UserService;
  let el: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule],
      providers: [UserService]
    });

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    service = TestBed.get(UserService);
    el = fixture.debugElement;
    fixture.detectChanges();
  });

  it('Should get login button and without logout button \
  before authenticated user.', () => {
    const loginBTN = el.nativeElement.querySelector('#submitBtn');
    const logoutBTN = el.nativeElement.querySelector('#logoutBtn');

    expect(loginBTN).toBeTruthy();
    expect(loginBTN.textContent.trim()).toBe('login');
    expect(logoutBTN).toBeNull();
  });

  xit('should show user email, logout button and \
  without login button after authenticated.', () => {
    const testId = 'v1';
    const testpwd = 'v11';
    spyOn(service, 'isAuth').and.returnValue(true);
    component.form.patchValue({userid: testId, password: testpwd});
    component.login();
    fixture.detectChanges();  // 重要！

    const userInfo = el.nativeElement.querySelector('#userId');
    const loginBTN = el.nativeElement.querySelector('#submitBtn');
    const logoutBTN = el.nativeElement.querySelector('#logoutBtn');

    expect(userInfo.textContent.trim()).toBe(testId);
    expect(loginBTN).toBeNull();
    expect(logoutBTN).toBeTruthy();
  });

  //async test fail
  xit('should show user email, logout button and \
  without login button after authenticated.', () => {
    const testId = 'v1';
    const testpwd = 'v11';
    spyOn(service, 'asynAuth').and.returnValue(of(true).pipe(delay(3000)));
    component.form.patchValue({userid: testId, password: testpwd});
    component.login();
    fixture.detectChanges();  // 重要！

    const userInfo = el.nativeElement.querySelector('#userId');
    const loginBTN = el.nativeElement.querySelector('#submitBtn');
    const logoutBTN = el.nativeElement.querySelector('#logoutBtn');

    expect(userInfo.textContent.trim()).toBe(testId);
    expect(loginBTN).toBeNull();
    expect(logoutBTN).toBeTruthy();
  });
});

// async test section
describe('Async testing authenticated.', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let service: UserService;
  let el: DebugElement;     // 要使用它來 query dOM

  // 創造一個 假 的 demo service
  let fakeService = jasmine.createSpyObj('user', ['asynAuth']);
  let spy = fakeService.asynAuth.and.returnValue(
    of(true).pipe(delay(3000)));

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [
        {provide: UserService , useValue: fakeService}
      ]
    });

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
    fixture.detectChanges();
  });

  // wheStable
  it('async testing via WhenStable: after authenticated should \
  get email info, logut button and can not find login button.',
  () => {
    const testId = 'v1';
    const testpwd = 'v11';
    component.form.patchValue({ userid: testId, password: testpwd });
    component.login();

    // whenStable testing way
    fixture.whenStable().then(() => {
      fixture.detectChanges();

      const userInfo = el.nativeElement.querySelector('#userId');
      const loginBTN = el.nativeElement.querySelector('#submitBtn');
      const logoutBTN = el.nativeElement.querySelector('#logoutBtn');

      // 顯示使用者的 email
      expect(userInfo.textContent.trim()).toBe(testId);
      // 有登出按鈕
      expect(logoutBTN).toBeTruthy();
      // 沒有登入按鈕
      expect(loginBTN).toBeNull();
    });
  });

  // Jasmine done function
  it('async testing via done: after authenticated should \
  get email info , logut button and can not find login button',
    (done: DoneFn) => {    // <-- done 參數！
      const testId = 'v1';
      const testpwd = 'v11';
      component.form.patchValue({ userid: testId, password: testpwd });
      component.login();

      spy.calls.mostRecent().returnValue.subscribe(() => {
        fixture.detectChanges();
        const userInfo = el.nativeElement.querySelector('#userId');
        const loginBTN = el.nativeElement.querySelector('#submitBtn');
        const logoutBTN = el.nativeElement.querySelector('#logoutBtn');
        // 顯示使用者的 email
        expect(userInfo.textContent.trim()).toBe(testId);
        // 有登出按鈕
        expect(logoutBTN).toBeTruthy();
        // 沒有登入按鈕
        expect(loginBTN).toBeNull();
        done();   // 重要！別忘記加
      });
    });
});
