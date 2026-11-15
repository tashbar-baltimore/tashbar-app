// School-owned synthetic recovery rehearsal.
function connectSchoolRestoreRehearsal(){
 owner_();
 const target='1YR6OEGY04sjqDp4M6pjfZAuaSof5OoB4K1RVUiVBwMg';
 const book=SpreadsheetApp.openById(target);
 const students=book.getSheetByName('TL Students').getRange(2,2,2,1).getValues().map(r=>JSON.parse(r[0]).id);
 if(students.join(',')!=='DEMO-01,DEMO-02')throw Error('Synthetic roster required.');
 PropertiesService.getScriptProperties().setProperty('SCHOOL_STAGING_DATABASE_ID',target);
 console.log('Next execution uses synthetic restore rehearsal: '+target);
}
function reconnectSchoolActiveStaging(){
 owner_();
 PropertiesService.getScriptProperties().setProperty('SCHOOL_STAGING_DATABASE_ID','1VyEgs-57Pi3VAVqZwWySBAvosJ4gLjlixofHFmW64Ak');
 console.log('Next execution uses active synthetic staging: 1VyEgs-57Pi3VAVqZwWySBAvosJ4gLjlixofHFmW64Ak');
}
