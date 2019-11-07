import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { MyhttpService, DataForm } from './myhttp.service';

describe('MyhttpService by SpyOn', () => {
  let myhttpServ: MyhttpService;

  beforeEach(() => {TestBed.configureTestingModule({
    imports: [HttpClientModule],
    providers: [MyhttpService]
  }).compileComponents();
});

  beforeEach( () => {
    myhttpServ = TestBed.get(MyhttpService);
    spyOn(myhttpServ, 'getUsers').and.returnValue(
      of([{id: 1, name: 'clover'}])
    );
  });

  it('should be created', () => {
    const service: MyhttpService = TestBed.get(MyhttpService);
    expect(service).toBeTruthy();
  });

  it('get id: 1 name: clover', () => {
    myhttpServ.getUsers().subscribe(res => {
      expect(res[0].id).toBe(1);
      expect(res[0].name).toBe('clover');
    });
  });
});
