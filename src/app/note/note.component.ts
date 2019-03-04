import { Component, OnInit, Output, EventEmitter, Input, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NoteService } from '../core/service/note/note.service';
import { HttpService } from '../core/service/http/http.service';
import { MatSnackBar, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Note } from '../core/model/note/note';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit {
  public showHeader = true;
  @Output() public open = new EventEmitter();
  @Output() public btnClick = new EventEmitter();
  @Output() public createOrUpdateNote = new EventEmitter();
  @Input() public data: Note = <Note>{};
  @Input() public templateType = '';


  public buttons = [{
    name: 'notifications',
    tooltip: 'notifications'
  },
  {
    name: 'color_lens',
    tooltip: 'change color'
  },
  {
    name: 'person_add',
    tooltip: 'collaborator'
  }, {
    name: 'image',
    tooltip: 'image upload'
  },
  {
    name: 'archive',
    tooltip: 'archive'
  },

  {
    name: 'undo',
    tooltip: 'undo'
  }, {
    name: 'redo',
    tooltip: 'redo'
  }]



  createNoteForm: FormGroup;
  loading = false;
  submitted = false;
  public mytoken = localStorage.getItem('token')
  public notes: Note[] = [];

  constructor(private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data1: any,
    public dialogRef: MatDialogRef<NoteComponent>) { }

  ngOnInit() {
    this.createNoteForm = this.formBuilder.group({
      title: [''],
      description: ['']
    });
  }


  get f() { return this.createNoteForm.controls; }



  public onClickBtn(btn) {
    const data = { btn, note: this.data };
    this.btnClick.emit(data);
  }


  onSubmit(note) {
    this.submitted = true;
    if (this.createNoteForm.invalid) {
      return;
    }
    const { title, description } = this.createNoteForm.value;

    if (!title && !description) {
      return;
    }

    this.createOrUpdateNote.emit(note);
    if(!note.id){
      this.createNoteForm.reset();
    }
  }


  public openNote() {
    this.open.emit(this.data);
  }


  onClose(note) {

  }
}
