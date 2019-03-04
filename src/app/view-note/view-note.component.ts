import { Component, OnInit } from '@angular/core';
import { NoteService } from '../core/service/note/note.service';
import { Note } from '../core/model/note/note';
import { UpdateNoteComponent } from '../update-note/update-note.component';
import { MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NoteComponent } from '../note/note.component';
enum Actions {
  DELETE = 'delete',
  ARCHIVE = 'archive',
  PIN='pin'
}
@Component({
  selector: 'app-view-note',
  templateUrl: './view-note.component.html',
  styleUrls: ['./view-note.component.css']
})
export class ViewNoteComponent implements OnInit {
  public myNote: Note;
  public mytoken = '';
  public notes: Note[] = [];
 
  constructor(private noteService: NoteService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar) { }

  ngOnInit() {

    this.mytoken = localStorage.getItem('token');
    this.getNotes();
  }
  getNotes() {
    console.log("token", this.mytoken);
    this.noteService.retrieveNotes(this.mytoken).subscribe((allNotes) => {
      this.notes = allNotes.filter((item) => !item.archive && !item.inTrash);
    }
    )
  }
  openDialog(note: Note): void {
    const dialogRef = this.dialog.open(UpdateNoteComponent, {
      width: '550px',
      data: note
    });
    this.myNote = note;
     
    dialogRef.afterClosed().subscribe(result => {
      this.noteService.updateNote(note).subscribe(response => {
        this.snackBar.open("Note updated successfully", "OK", {
          duration: 3000,
        });
      })
      console.log('The dialog was closed');
    });
  }

  public onAction({ btn, note }): void {
    if (btn.name === Actions.ARCHIVE) {
      this.sendToArchive(note);
    } else if (btn.name === Actions.DELETE) {
      this.deleteNote(note);
    }
    else if (btn.name === Actions.PIN) {
      this.moveToPin(note);
    }
  }

  public onCreateOrUpdateNote(formData) {
    this.noteService.createNote(formData).subscribe(response => {
      this.snackBar.open("success", "note created", {
        duration: 2000
      });
      this.getNotes();
    }
    )
  }



  private deleteNote(note) {
    var newNote = {
      ...note,
      inTrash: true,
    }
    this.noteService.updateNote(newNote).subscribe(response => {
      this.snackBar.open("Sent to Trash ", "OK", {
        duration: 3000,
      });
      this.getNotes();
    },
      (error) => {
        console.log('Error while deleting note::->', error);
      })
  }




  private sendToArchive(note) {
    const newNote = {
      ...note,
      archive: true
    }
    this.noteService.updateNote(newNote).subscribe(response => {
      this.snackBar.open("Sent to Archive ", "OK", {
        duration: 3000,
      });
      this.getNotes();
    },
      (error) => {
        console.log('Error while archiving note::->', error);
      })
  }



 private moveToPin(note) {
    var newNote = {

      ...note,
      "pinned": true
    }
    this.noteService.updateNote(newNote).subscribe(response => {
      this.snackBar.open("Pinned", "OK", {
        duration: 3000,
      });
      this.getNotes();
    },
    (error) => {
      console.log('Error while pinning note::->', error);
    })

  }

}


