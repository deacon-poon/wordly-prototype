<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Wordly — Attendee Highlights Prototype C</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bb25:#f0f7ff;--bb50:#d6eaff;--bb100:#b2d8ff;--bb200:#75b8ff;--bb300:#3396ff;--bb400:#017cff;--bb500:#0063cc;--bb600:#0051a8;--bb700:#00458f;--bb800:#002c5c;--bb900:#001e3d;
  --ag50:#dafbe4;--ag200:#84f1a2;--ag700:#0f802f;
  --g50:#f8f9fa;--g100:#eef0f2;--g200:#e3e6e8;--g300:#cdd2d7;--g400:#9ba3ab;--g500:#646e78;--g700:#343a40;--g900:#121416;
  --text-p:#121416;--text-s:#646e78;--text-d:#9ba3ab;
  --border:#cdd2d7;--border-light:#e3e6e8;
  --white:#ffffff;
  --btn-p:#0063cc;--btn-p-hover:#0051a8;
  --success-text:#0a7b3f;--success-bg:#e6f6ec;--success-border:#c5e8d2;
  --error-text:#b8221a;--error-bg:#fcebea;--error-border:#f9cfcc;
  --font:'Roboto',sans-serif;
}
html,body{font-family:var(--font);background:#f0f4f8;color:var(--text-p);height:100%;margin:0;}

.frame{
  background:var(--white);
  display:flex;
  flex-direction:column;
  height:100vh;
  max-width:1200px;
  margin:0 auto;
  border-left:1px solid var(--border-light);
  border-right:1px solid var(--border-light);
}

/* TOP NAV */
.attend-top-nav{display:flex;align-items:center;justify-content:space-between;padding:0 16px 0 20px;height:56px;border-bottom:1px solid var(--border-light);background:var(--white);flex-shrink:0;}
.wordmark{height:22px;width:auto;display:block;}
.nav-right{display:flex;align-items:center;gap:8px;}
.view-toggle{display:flex;background:var(--g100);border:1px solid var(--border-light);border-radius:8px;padding:2px;gap:2px;}
.vt-btn{padding:5px 13px;border-radius:6px;font-size:12px;font-weight:500;cursor:pointer;border:none;background:transparent;color:var(--text-s);font-family:var(--font);transition:all .18s;white-space:nowrap;}
.vt-btn.active{background:var(--white);color:var(--text-p);box-shadow:0 1px 3px rgba(0,0,0,0.1);}
.nav-hamburger{width:32px;height:32px;display:flex;flex-direction:column;gap:5px;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;}
.nav-hamburger span{width:20px;height:1.5px;background:var(--g900);border-radius:1px;}

/* SUB NAV */
.sub-nav{display:flex;align-items:center;justify-content:space-between;padding:0 20px;height:44px;border-bottom:1px solid var(--border-light);background:var(--white);flex-shrink:0;position:relative;}
.session-id-text{font-size:14px;font-weight:500;color:var(--text-s);}
.sub-nav-right{display:flex;align-items:center;gap:4px;}
.icon-btn{width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:8px;cursor:pointer;border:none;background:transparent;color:var(--text-s);transition:background .15s;}
.icon-btn:hover{background:var(--g100);}
.lang-selector{display:flex;align-items:center;gap:4px;padding:0 8px;height:36px;border-radius:8px;cursor:pointer;color:var(--text-p);font-size:13px;font-weight:500;font-family:var(--font);border:none;background:transparent;border-bottom:2px solid var(--bb400);}

/* Language picker popover (anchored to lang-selector) */
.lang-popover{position:absolute;top:46px;right:48px;z-index:250;background:var(--white);border:1px solid var(--border);border-radius:10px;box-shadow:0 8px 32px rgba(0,14,36,0.18);width:280px;max-height:380px;overflow-y:auto;padding:6px 0;font-family:var(--font);}
.lang-popover.hidden{display:none;}
.lang-popover::-webkit-scrollbar{width:4px;}
.lang-popover::-webkit-scrollbar-thumb{background:var(--g200);border-radius:2px;}
.lang-group-label{font-size:10px;font-weight:700;color:var(--text-d);letter-spacing:0.08em;text-transform:uppercase;padding:8px 14px 4px;}
.lang-option{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 14px;font-size:13px;color:var(--text-p);cursor:pointer;background:transparent;border:none;width:100%;text-align:left;font-family:var(--font);transition:background .12s;}
.lang-option:hover{background:var(--g50);}
.lang-option.selected{background:var(--bb25);color:var(--bb700);font-weight:600;}
.lang-option .lang-check{color:var(--bb500);flex-shrink:0;display:none;}
.lang-option.selected .lang-check{display:block;}

/* MAIN */
.main{flex:1;display:flex;overflow:hidden;min-height:0;position:relative;}

/* ATTENDEE VIEW */
#view-attendee{display:flex;width:100%;overflow:hidden;min-height:0;position:relative;}

.transcript-col{flex:1;display:flex;flex-direction:column;overflow:hidden;border-right:1px solid var(--border-light);min-height:0;}
.transcript-scroll{flex:1;overflow-y:auto;padding:20px 20px 12px;min-height:0;}
.transcript-scroll::-webkit-scrollbar{width:4px;}
.transcript-scroll::-webkit-scrollbar-thumb{background:var(--g200);border-radius:2px;}
.speaker-group{margin-bottom:4px;}
.speaker-label{font-size:13px;font-weight:500;color:var(--text-s);margin:12px 0 6px 4px;}
.bubble-row{display:flex;align-items:center;gap:8px;margin-bottom:6px;}
@keyframes bubbleIn{from{opacity:0;transform:translateY(5px);}to{opacity:1;transform:none;}}
.bubble-row.new{animation:bubbleIn .18s ease-out;}
.bubble{position:relative;display:inline-flex;align-items:center;background:var(--g100);border-radius:0 18px 18px 18px;padding:10px 16px;font-size:15px;line-height:1.4;color:var(--text-p);cursor:pointer;transition:background .15s,border-color .15s;max-width:100%;border:1.5px solid transparent;user-select:none;}
.bubble:hover{background:var(--g200);}
/* note: blue outline on bubbles is reserved for TTS "now speaking" indication —
   highlighted bubbles are marked by the corner reaction badge only */

/* DESKTOP HIGHLIGHTS PANEL */
.hlp-header{padding:14px 16px 10px;border-bottom:1px solid var(--border-light);flex-shrink:0;}
.hlp-title{font-size:13px;font-weight:600;color:var(--text-p);display:flex;align-items:center;gap:8px;}
.hlp-count{background:var(--bb500);color:#fff;border-radius:10px;padding:1px 7px;font-size:11px;font-weight:600;}
.hlp-scroll{flex:1;overflow-y:auto;padding:10px 12px;display:flex;flex-direction:column;gap:6px;min-height:0;}
.hlp-scroll::-webkit-scrollbar{width:3px;}
.hlp-scroll::-webkit-scrollbar-thumb{background:var(--g200);border-radius:2px;}
.hlp-footer{padding:12px;border-top:1px solid var(--border-light);display:flex;flex-direction:column;gap:8px;flex-shrink:0;}
.hlp-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:12px;text-align:center;padding:24px;}
.hlp-empty-text{font-size:13px;line-height:1.6;color:var(--text-d);}
.hlp-empty-text .inline-icon{display:inline-flex;vertical-align:middle;position:relative;top:-1px;margin:0 1px;}
.hlp-item{position:relative;background:var(--bb25);border:1px solid var(--bb100);border-left:3px solid var(--bb400);border-radius:8px;padding:8px 10px;cursor:pointer;transition:background .15s;flex-shrink:0;}
.hlp-item:hover{background:var(--bb50);}
.hlp-item-time{font-size:11px;color:var(--bb600);font-weight:500;margin-bottom:3px;}
.hlp-item-text{font-size:12px;line-height:1.5;color:var(--text-s);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
.btn-primary-sm{background:var(--btn-p);color:#fff;border:none;border-radius:8px;padding:9px 16px;font-size:13px;font-weight:500;font-family:var(--font);cursor:pointer;width:100%;transition:background .15s;display:flex;align-items:center;justify-content:center;gap:6px;}
.btn-primary-sm:hover{background:var(--btn-p-hover);}
.btn-secondary-sm{background:var(--white);color:var(--text-p);border:1px solid var(--border);border-radius:8px;padding:8px 16px;font-size:13px;font-weight:500;font-family:var(--font);cursor:pointer;width:100%;transition:background .15s;}
.btn-secondary-sm:hover{background:var(--g50);}
.email-input{border:1px solid var(--border);border-radius:8px;padding:8px 10px;font-size:13px;color:var(--text-p);font-family:var(--font);width:100%;outline:none;}
.email-input:focus{border-color:var(--bb400);box-shadow:0 0 0 2px rgba(0,99,204,0.12);}
.email-input::placeholder{color:var(--text-d);}

/* MOBILE FAB */
.fab{display:none;position:absolute;bottom:20px;right:20px;width:52px;height:52px;border-radius:50%;background:var(--bb500);border:none;cursor:pointer;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(0,99,204,0.4);z-index:10;transition:background .15s,transform .15s;}
.fab:hover{background:var(--btn-p-hover);transform:scale(1.05);}
.fab-badge{position:absolute;top:-4px;right:-4px;width:20px;height:20px;background:#e62d21;color:#fff;border-radius:50%;border:2px solid var(--white);font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;font-family:var(--font);opacity:0;transition:opacity .2s;}
.fab-badge.visible{opacity:1;}

/* MOBILE BOTTOM SHEET */
.bottom-sheet-overlay{display:none;position:absolute;inset:0;background:rgba(0,0,0,0.35);z-index:20;opacity:0;transition:opacity .25s;}
.bottom-sheet-overlay.open{opacity:1;}
.bottom-sheet{position:absolute;bottom:0;left:0;right:0;background:var(--white);border-radius:16px 16px 0 0;display:flex;flex-direction:column;max-height:72%;transform:translateY(100%);transition:transform .3s cubic-bezier(.32,.72,0,1);overflow:hidden;}
.bottom-sheet.open{transform:translateY(0);}
.bs-handle{width:36px;height:4px;background:var(--g300);border-radius:2px;margin:10px auto 0;flex-shrink:0;}
.bs-header{padding:12px 16px 10px;display:flex;align-items:center;gap:8px;flex-shrink:0;}
.bs-title{font-size:15px;font-weight:600;color:var(--text-p);flex:1;}
.bs-close{width:28px;height:28px;border-radius:50%;border:none;background:var(--g100);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text-s);}
.bs-scroll{flex:1;overflow-y:auto;padding:6px 16px 0;display:flex;flex-direction:column;gap:8px;min-height:0;}
.bs-scroll::-webkit-scrollbar{width:3px;}
.bs-scroll::-webkit-scrollbar-thumb{background:var(--g200);border-radius:2px;}
.bs-empty{display:flex;flex-direction:column;align-items:center;gap:10px;padding:24px;text-align:center;color:var(--text-d);}
.bs-empty-text{font-size:13px;line-height:1.55;}
.bs-item{position:relative;background:var(--bb25);border:1px solid var(--bb100);border-left:3px solid var(--bb400);border-radius:8px;padding:10px 12px;cursor:pointer;transition:background .15s;flex-shrink:0;}
.bs-item:hover{background:var(--bb50);}
.bs-item-time{font-size:11px;color:var(--bb600);font-weight:500;margin-bottom:4px;}
.bs-item-text{font-size:13px;line-height:1.5;color:var(--text-s);}
.bs-footer{padding:14px 16px;flex-shrink:0;}
.bs-cta{background:var(--bb500);color:#fff;border:none;border-radius:10px;padding:14px;font-size:15px;font-weight:600;font-family:var(--font);cursor:pointer;width:100%;transition:background .15s;}
.bs-cta:hover{background:var(--btn-p-hover);}
.bs-cta-secondary{background:var(--white);color:var(--text-p);border:1px solid var(--border);border-radius:10px;padding:13px;font-size:15px;font-weight:500;font-family:var(--font);cursor:pointer;width:100%;transition:background .15s;}
.bs-cta-secondary:hover{background:var(--g50);}
.bs-email-input{border:1px solid var(--border);border-radius:8px;padding:10px 12px;font-size:14px;color:var(--text-p);font-family:var(--font);width:100%;outline:none;}
.bs-email-input:focus{border-color:var(--bb400);box-shadow:0 0 0 2px rgba(0,99,204,0.12);}
.bs-email-input::placeholder{color:var(--text-d);}
.ended-email-input{border:1px solid var(--border);border-radius:8px;padding:10px 12px;font-size:14px;color:var(--text-p);font-family:var(--font);width:100%;outline:none;display:block;}
.ended-email-input:focus{border-color:var(--bb400);box-shadow:0 0 0 2px rgba(0,99,204,0.12);}
.ended-email-input::placeholder{color:var(--text-d);}

@media (max-width:600px){
  .transcript-col{border-right:none;}
  .fab{display:flex;}
  .bottom-sheet-overlay{display:block;}
  .view-toggle .vt-btn{padding:5px 9px;font-size:11px;}
}

/* PORTAL */
#view-organizer{display:none;width:100%;min-height:0;overflow:hidden;}
.portal-wrap{display:flex;width:100%;height:100%;overflow:hidden;}
.portal-content{flex:1;display:flex;flex-direction:column;overflow:hidden;min-height:0;}
.portal-body{flex:1;display:flex;overflow:hidden;min-height:0;}
/* Portal side nav */
.portal-nav-item{display:flex;align-items:center;gap:10px;padding:9px 16px;font-size:13px;font-weight:500;color:var(--text-s);cursor:pointer;transition:background .15s,color .15s;background:var(--white);}
.portal-nav-item:hover{background:var(--g100);color:var(--text-p);}
.portal-nav-item.active{background:var(--bb500);color:#fff;font-weight:600;}
.portal-nav-item svg{flex-shrink:0;}
.portal-nav-item.active svg{stroke:#fff;}

.session-list{width:280px;border-right:1px solid var(--border-light);display:flex;flex-direction:column;background:var(--white);flex-shrink:0;overflow:hidden;min-height:0;}
.session-list-header{padding:14px 16px;border-bottom:1px solid var(--border-light);flex-shrink:0;}
.session-list-title{font-size:14px;font-weight:600;color:var(--text-p);margin-bottom:8px;}
.session-search{display:flex;align-items:center;gap:6px;background:var(--g50);border:1px solid var(--border-light);border-radius:6px;padding:6px 10px;}
.session-search svg{width:14px;height:14px;color:var(--text-d);flex-shrink:0;}
.session-search input{border:none;background:transparent;font-size:12px;color:var(--text-p);font-family:var(--font);outline:none;width:100%;}
.session-list-scroll{flex:1;overflow-y:auto;min-height:0;}
.session-list-scroll::-webkit-scrollbar{width:3px;}
.session-list-scroll::-webkit-scrollbar-thumb{background:var(--g200);border-radius:2px;}
.session-item{padding:12px 16px;border-bottom:1px solid var(--border-light);cursor:pointer;transition:background .15s;}
.session-item:hover{background:var(--g50);}
.session-item.active{background:var(--bb25);border-left:3px solid var(--bb500);padding-left:13px;}
.session-item.active .session-item-id{color:var(--bb600);}
.session-item-id{font-size:13px;font-weight:600;color:var(--text-p);margin-bottom:2px;}
.session-item-date{font-size:11px;color:var(--text-s);}
.session-item-meta{display:flex;align-items:center;gap:6px;margin-top:4px;flex-wrap:wrap;}
.session-badge{font-size:10px;font-weight:600;padding:2px 6px;border-radius:3px;}
.session-badge.completed{background:var(--success-bg);color:var(--success-text);}
.session-badge.highlights{background:var(--bb25);color:var(--bb600);display:flex;align-items:center;gap:3px;border:1px solid var(--bb100);}
.session-detail{flex:1;display:flex;flex-direction:column;overflow:hidden;background:var(--g50);min-height:0;}
.detail-session-id{font-size:18px;font-weight:700;color:var(--text-p);margin-bottom:4px;letter-spacing:0.02em;}
.detail-meta{font-size:12px;color:var(--text-s);display:flex;align-items:center;gap:12px;flex-wrap:wrap;}
.detail-meta-item{display:flex;align-items:center;gap:4px;}
.detail-meta-item svg{width:12px;height:12px;color:var(--text-d);}
.detail-actions{display:flex;align-items:center;gap:8px;flex-shrink:0;}
.detail-action-btn{display:flex;align-items:center;gap:5px;padding:6px 12px;border-radius:6px;border:1px solid var(--border);background:var(--white);font-size:12px;font-weight:500;color:var(--text-s);cursor:pointer;font-family:var(--font);transition:background .15s;}
.detail-action-btn:hover{background:var(--g50);}
.detail-action-btn svg{width:13px;height:13px;}
.detail-body{flex:1;overflow-y:auto;padding:16px 20px;display:flex;flex-direction:column;gap:14px;min-height:0;}
.detail-body::-webkit-scrollbar{width:4px;}
.detail-body::-webkit-scrollbar-thumb{background:var(--g200);border-radius:2px;}
/* ensure detail-header never shrinks */
.detail-header{background:var(--white);border-bottom:1px solid var(--border-light);padding:16px 20px;display:flex;align-items:flex-start;justify-content:space-between;flex-shrink:0;}
.card{background:var(--white);border:1px solid var(--border-light);border-radius:10px;overflow:hidden;margin-bottom:14px;}
.card-header{padding:12px 16px;border-bottom:1px solid var(--border-light);display:flex;align-items:center;justify-content:space-between;}
.card-title{font-size:13px;font-weight:600;color:var(--text-p);display:flex;align-items:center;gap:8px;}
.card-icon{width:26px;height:26px;border-radius:6px;background:var(--g50);border:1px solid var(--border-light);display:flex;align-items:center;justify-content:center;}
.card-icon svg{width:13px;height:13px;color:var(--text-s);}
.card-body{padding:14px 16px;}
.usage-row{display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--border-light);font-size:12px;}
.usage-row:last-child{border-bottom:none;}
.usage-label{color:var(--text-s);}
.usage-value{color:var(--text-p);font-weight:500;}
.lang-bar-row{display:flex;flex-direction:column;gap:4px;}
.lang-bar-label{display:flex;justify-content:space-between;align-items:baseline;}
.lang-bar-name{font-size:12px;color:var(--text-p);font-weight:500;}
.lang-bar-count{font-size:11px;color:var(--text-s);}
.lang-bar-track{width:100%;height:8px;background:var(--g100);border-radius:4px;overflow:hidden;}
.lang-bar-fill{height:100%;border-radius:4px;transition:width .4s ease;}
.lang-row{display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid var(--border-light);font-size:12px;}
.lang-row:last-child{border-bottom:none;}
.lang-flag{width:18px;height:13px;border-radius:2px;flex-shrink:0;}
.lang-name{flex:1;color:var(--text-p);}
.lang-count{color:var(--text-s);}
.engagement-card{background:var(--white);border:1px solid var(--bb100);border-radius:10px;overflow:hidden;margin-bottom:14px;}
.engagement-header{padding:12px 16px;border-bottom:1px solid var(--bb100);background:var(--bb25);display:flex;align-items:center;gap:8px;}
.engagement-icon{width:26px;height:26px;border-radius:6px;background:var(--bb50);border:1px solid var(--bb200);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.engagement-title{font-size:13px;font-weight:600;color:var(--text-p);flex:1;}
.new-tag{display:inline-flex;background:var(--ag50);border:1px solid var(--ag200);color:var(--ag700);border-radius:3px;padding:2px 5px;font-size:10px;font-weight:700;letter-spacing:0.04em;}
.engagement-body{padding:14px 16px;display:flex;flex-direction:column;gap:12px;}
.eng-metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;}
.eng-metric{background:var(--g50);border:1px solid var(--border-light);border-radius:7px;padding:10px 12px;}
.eng-metric-label{font-size:10px;color:var(--text-s);font-weight:500;margin-bottom:5px;line-height:1.3;}
.eng-metric-value{font-size:20px;font-weight:700;color:var(--text-p);line-height:1;}
.eng-metric-sub{font-size:10px;color:var(--text-d);margin-top:3px;}
.moments-section-title{font-size:11px;font-weight:600;color:var(--text-s);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;}
.moment-item{display:flex;align-items:flex-start;gap:8px;padding:7px 0;border-bottom:1px solid var(--border-light);font-size:12px;}
.moment-item:last-child{border-bottom:none;}
.moment-num{width:18px;height:18px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;flex-shrink:0;margin-top:1px;}
.moment-num.n1{background:var(--bb25);color:var(--bb600);border:1px solid var(--bb100);}
.moment-num.n2,.moment-num.n3{background:var(--g100);color:var(--text-s);border:1px solid var(--g200);}
.moment-txt{flex:1;color:var(--text-p);line-height:1.45;}
.moment-ct{font-size:11px;font-weight:600;color:var(--bb600);background:var(--bb25);border:1px solid var(--bb100);border-radius:4px;padding:2px 6px;flex-shrink:0;white-space:nowrap;}
.ai-summary-block{background:var(--bb25);border:1px solid var(--bb100);border-radius:7px;padding:10px 12px;}
.ai-summary-header{display:flex;align-items:center;gap:6px;margin-bottom:6px;}
.ai-badge{display:inline-flex;align-items:center;gap:4px;background:var(--white);border:1px solid var(--bb200);border-radius:4px;padding:2px 7px;font-size:10px;font-weight:600;color:var(--bb600);}
.ai-summary-text{font-size:12px;line-height:1.6;color:var(--g700);}
.ai-shimmer{height:11px;background:var(--bb100);border-radius:3px;animation:shim 1.4s ease-in-out infinite;margin-bottom:6px;}
.ai-shimmer.s2{width:85%;}.ai-shimmer.s3{width:68%;margin-bottom:0;}
.shimmer-gray{height:11px;background:var(--g200);border-radius:3px;animation:shim 1.4s ease-in-out infinite;margin-bottom:6px;}
@keyframes shim{0%,100%{opacity:.5;}50%{opacity:1;}}
.ai-loading-note{display:flex;align-items:center;gap:5px;font-size:10px;color:var(--bb600);margin-bottom:6px;}
.spinner{width:10px;height:10px;border:1.5px solid var(--bb100);border-top-color:var(--bb500);border-radius:50%;animation:spin .7s linear infinite;}
@keyframes spin{to{transform:rotate(360deg);}}
.ai-state-toggles{display:flex;gap:4px;}
.ai-toggle-btn{font-size:10px;padding:2px 7px;border-radius:4px;cursor:pointer;font-family:var(--font);border:1px solid var(--border);background:var(--white);color:var(--text-s);}
.divider{height:1px;background:var(--border-light);}
@keyframes hlIn{from{opacity:0;transform:translateX(6px);}to{opacity:1;transform:none;}}

/* SESSION ENDED MODAL */
.ended-overlay{position:absolute;inset:0;background:rgba(0,0,0,0.55);z-index:50;display:flex;align-items:flex-start;justify-content:center;padding:24px 16px;overflow-y:auto;}
.ended-modal{background:var(--white);border-radius:16px;width:100%;max-width:520px;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.18);animation:modalIn .22s ease-out;}
.ended-modal-header{padding:24px 24px 16px;display:flex;align-items:flex-start;justify-content:space-between;border-bottom:1px solid var(--border-light);}
.ended-modal-title{font-size:20px;font-weight:700;color:var(--text-p);margin-bottom:4px;}
.ended-modal-subtitle{font-size:14px;color:var(--text-s);}
.ended-modal-subtitle a{color:var(--bb500);text-decoration:none;}
.ended-modal-subtitle a:hover{text-decoration:underline;}
.ended-close-btn{width:32px;height:32px;border:none;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--text-d);border-radius:6px;flex-shrink:0;margin-top:-4px;}
.ended-close-btn:hover{background:var(--g100);color:var(--text-s);}
.ended-modal-body{overflow-y:auto;padding:24px;display:flex;flex-direction:column;gap:20px;max-height:calc(100vh - 260px);}
.ended-modal-body::-webkit-scrollbar{width:4px;}
.ended-modal-body::-webkit-scrollbar-thumb{background:var(--g200);border-radius:2px;}
.ended-section-title{font-size:15px;font-weight:700;color:var(--text-p);margin-bottom:10px;}
.ended-summary-box{background:var(--g50);border-radius:10px;padding:14px 16px;font-size:14px;line-height:1.65;color:var(--text-p);}
.ended-hl-summary-box{background:var(--bb25);border-radius:10px;padding:14px 16px;font-size:14px;line-height:1.65;color:var(--text-p);}
.ended-divider{height:1px;background:var(--border-light);}
.ended-hl-section-header{display:flex;align-items:center;gap:8px;margin-bottom:10px;}
.ended-hl-section-title{font-size:15px;font-weight:700;color:var(--text-p);}
.ended-hl-items{display:flex;flex-direction:column;gap:8px;}
.ended-hl-item{background:var(--bb25);border:1px solid var(--bb100);border-radius:10px;padding:12px 14px;font-size:14px;line-height:1.55;color:var(--text-p);}
.ended-no-highlights{font-size:14px;color:var(--text-s);font-style:italic;padding:4px 0;}
.ended-modal-footer{padding:16px 24px;border-top:1px solid var(--border-light);display:flex;flex-direction:column;gap:10px;}
.ended-btn-primary{background:var(--bb500);color:#fff;border:none;border-radius:10px;padding:14px;font-size:15px;font-weight:600;font-family:var(--font);cursor:pointer;width:100%;transition:background .15s;}
.ended-btn-primary:hover{background:var(--btn-p-hover);}
.ended-btn-secondary{background:var(--white);color:var(--text-p);border:1px solid var(--border);border-radius:10px;padding:13px;font-size:15px;font-weight:500;font-family:var(--font);cursor:pointer;width:100%;transition:background .15s;}
.ended-btn-secondary:hover{background:var(--g50);}
@keyframes modalIn{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:none;}}

/* JOIN FORM OVERLAY */
.join-overlay{position:fixed;inset:0;background:rgba(0,14,36,0.55);z-index:100;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(3px);}
.join-overlay.hidden{display:none;}
.join-card{background:var(--white);border-radius:16px;width:100%;max-width:420px;box-shadow:0 24px 64px rgba(0,14,36,0.22);overflow:hidden;}
.join-card-header{padding:24px 24px 16px;}
.join-logo{height:20px;width:auto;margin-bottom:16px;}
.join-title{font-size:20px;font-weight:700;color:var(--text-p);margin-bottom:4px;}
.join-subtitle{font-size:13px;color:var(--text-s);line-height:1.5;}
.join-divider{height:1px;background:var(--border-light);}
.join-card-body{padding:20px 24px 24px;display:flex;flex-direction:column;gap:14px;}
.join-field{display:flex;flex-direction:column;gap:5px;}
.join-label{font-size:12px;font-weight:600;color:var(--text-p);letter-spacing:0.01em;}
.join-input{border:1px solid var(--border);border-radius:8px;padding:9px 12px;font-size:14px;color:var(--text-p);font-family:var(--font);outline:none;transition:border-color .15s,box-shadow .15s;}
.join-input:focus{border-color:var(--bb400);box-shadow:0 0 0 3px rgba(1,124,255,0.12);}
.join-input::placeholder{color:var(--text-d);}
.join-input.error{border-color:#e04040;box-shadow:0 0 0 3px rgba(224,64,64,0.1);}
.join-select{border:1px solid var(--border);border-radius:8px;padding:9px 12px;font-size:14px;color:var(--text-p);font-family:var(--font);outline:none;background:var(--white);cursor:pointer;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ba3ab' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 10px center;padding-right:30px;transition:border-color .15s,box-shadow .15s;}
.join-select:focus{border-color:var(--bb400);box-shadow:0 0 0 3px rgba(1,124,255,0.12);}
.join-error-msg{font-size:12px;color:var(--error-text);background:var(--error-bg);border:1px solid var(--error-border);border-radius:6px;padding:8px 10px;display:none;}
.join-error-msg.visible{display:block;}
.join-btn{background:var(--bb400);color:#fff;border:none;border-radius:10px;padding:12px 20px;font-size:15px;font-weight:600;font-family:var(--font);cursor:pointer;width:100%;transition:background .15s,transform .1s;display:flex;align-items:center;justify-content:center;gap:8px;}
.join-btn:hover{background:var(--bb500);}
.join-btn:active{transform:scale(0.99);}
.join-btn:disabled{background:var(--g300);cursor:not-allowed;transform:none;}
.join-demo-row{display:flex;align-items:center;justify-content:center;gap:6px;}
.join-demo-link{font-size:12px;color:var(--bb500);cursor:pointer;text-decoration:underline;text-underline-offset:2px;background:none;border:none;font-family:var(--font);}
.join-demo-link:hover{color:var(--bb600);}
.join-demo-label{font-size:12px;color:var(--text-d);}

/* CONNECTION STATUS PILL */
.conn-status{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:600;font-family:var(--font);border:1px solid transparent;cursor:default;flex-shrink:0;transition:background .2s,color .2s;}
.conn-status.connecting{background:#fff8e6;color:#9a6200;border-color:#ffe0a0;}
.conn-status.live{background:var(--success-bg);color:var(--success-text);border-color:var(--success-border);cursor:pointer;}
.conn-status.demo{background:var(--g100);color:var(--text-s);border-color:var(--border-light);}
.conn-status.error{background:var(--error-bg);color:var(--error-text);border-color:var(--error-border);cursor:pointer;}
.conn-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;}
.conn-status.connecting .conn-dot{background:#f59e0b;animation:pulse-dot 1s ease-in-out infinite;}
.conn-status.live .conn-dot{background:var(--success-text);}
.conn-status.demo .conn-dot{background:var(--text-d);}
.conn-status.error .conn-dot{background:var(--error-text);}
@keyframes pulse-dot{0%,100%{opacity:1;}50%{opacity:.35;}}

/* PENDING BUBBLE (non-final live phrases) */
.bubble.pending{cursor:default;pointer-events:none;}
.bubble.pending .bubble-text{color:var(--text-s);font-style:italic;}

/* AB TOGGLE */
.ab-toggle{display:flex;background:var(--g100);border:1px solid var(--border-light);border-radius:8px;padding:2px;gap:2px;}
.ab-btn{padding:3px 11px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;border:none;background:transparent;color:var(--text-s);font-family:var(--font);letter-spacing:0.04em;transition:all .15s;}
.ab-btn.active{background:var(--white);color:var(--text-p);box-shadow:0 1px 3px rgba(0,0,0,0.1);}

/* BUBBLE POPOVER — react + highlight in one action */
@keyframes popIn{from{opacity:0;transform:translateY(4px) scale(.96);}to{opacity:1;transform:none;}}
.bubble-popover{position:fixed;z-index:300;background:var(--white);border:1px solid var(--border);border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.14);padding:4px 5px;display:flex;flex-direction:row;align-items:center;gap:2px;animation:popIn .14s ease-out;}
.bubble-popover.hidden{display:none;}
.bp-react-btn{width:34px;height:34px;border-radius:8px;border:1px solid transparent;background:transparent;font-size:17px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .12s,border-color .12s;line-height:1;flex-shrink:0;}
.bp-react-btn:hover{background:var(--bb25);border-color:var(--bb200);}
.bp-react-btn.active{background:var(--bb50);border-color:var(--bb300);}

/* EMBEDDED REACTION BADGES — corner of bubble + saved highlight */
.bubble-react-corner{position:absolute;top:-9px;right:-7px;width:22px;height:22px;border-radius:50%;background:var(--white);border:1px solid var(--bb200);box-shadow:0 1px 4px rgba(0,0,0,0.14);display:flex;align-items:center;justify-content:center;font-size:12px;line-height:1;pointer-events:none;}
.hl-corner-react{position:absolute;top:-8px;right:-6px;width:22px;height:22px;border-radius:50%;background:var(--white);border:1px solid var(--bb200);box-shadow:0 1px 4px rgba(0,0,0,0.14);display:flex;align-items:center;justify-content:center;font-size:12px;line-height:1;pointer-events:none;}

/* MODE INDICATOR — Variant B */
.mode-indicator{display:none;padding:7px 16px;background:var(--bb25);border-bottom:1px solid var(--bb100);font-size:12px;font-weight:500;color:var(--bb800);align-items:center;gap:8px;flex-shrink:0;}
.mode-indicator.visible{display:flex;}
.mode-cancel-btn{margin-left:auto;font-size:11px;color:var(--bb600);background:none;border:none;cursor:pointer;font-family:var(--font);font-weight:600;padding:2px 6px;border-radius:4px;}
.mode-cancel-btn:hover{background:var(--bb100);}

/* ATTEND TOOLBAR — Variant B */
.attend-toolbar{flex-shrink:0;border-top:1px solid var(--border-light);background:var(--white);}
.toolbar-reaction-tray{display:none;gap:8px;padding:10px 16px;border-bottom:1px solid var(--border-light);align-items:center;}
.toolbar-reaction-tray.open{display:flex;}
.toolbar-react-lg{width:44px;height:44px;border-radius:10px;border:1px solid var(--border-light);background:var(--g50);font-size:21px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .12s;line-height:1;}
.toolbar-react-lg:hover{background:var(--bb25);border-color:var(--bb200);}
.toolbar-react-lg.active{background:var(--bb50);border-color:var(--bb400);}
.toolbar-btns{display:flex;align-items:stretch;height:60px;}
.toolbar-btn{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;border:none;background:transparent;color:var(--text-s);font-size:10px;font-weight:500;font-family:var(--font);cursor:pointer;padding:0;transition:color .12s,background .12s;border-radius:0;}
.toolbar-btn:hover{color:var(--text-p);background:var(--g50);}
.toolbar-btn.active{color:var(--bb500);}
.toolbar-btn-exit:hover{color:var(--error-text)!important;background:var(--error-bg)!important;}

/* HIGHLIGHTS PANEL COLLAPSE */
.highlights-col{width:280px;display:flex;flex-direction:column;background:var(--white);flex-shrink:0;min-height:0;overflow:hidden;}
.highlights-col.hl-collapsed{display:none;}
.hlp-header{display:flex;align-items:center;justify-content:space-between;padding:14px 10px 10px 16px;border-bottom:1px solid var(--border-light);flex-shrink:0;}
.hlp-collapse-btn{width:26px;height:26px;border:none;background:transparent;cursor:pointer;color:var(--text-d);display:flex;align-items:center;justify-content:center;border-radius:6px;flex-shrink:0;transition:color .12s,background .12s;}
.hlp-collapse-btn:hover{background:var(--g100);color:var(--text-s);}
@media (max-width:600px){.highlights-col{display:none!important;}}

/* REACTIONS BREAKDOWN (analytics) */
.react-breakdown-row{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px;}
.react-stat{display:flex;align-items:center;gap:5px;background:var(--g50);border:1px solid var(--border-light);border-radius:8px;padding:6px 10px;flex:1;min-width:0;}
.react-stat-emoji{font-size:15px;line-height:1;flex-shrink:0;}
.react-stat-count{font-size:13px;font-weight:700;color:var(--text-p);}
.react-stat-pct{font-size:11px;color:var(--text-d);margin-left:2px;}

/* ── PRESENTER VIEW ──────────────────────────────────────── */
.pres-wrap{display:flex;width:100%;height:100%;overflow:hidden;}

/* Left controls panel */
.pres-left{width:264px;border-right:1px solid var(--border-light);display:flex;flex-direction:column;background:var(--white);flex-shrink:0;overflow-y:auto;}
.pres-section{border-bottom:1px solid var(--border-light);}
.pres-section-hdr{display:flex;align-items:flex-start;justify-content:space-between;padding:14px 16px;cursor:pointer;user-select:none;gap:8px;}
.pres-section-hdr:hover{background:var(--g50);}
.pres-section-name{font-size:11px;font-weight:700;color:var(--text-p);letter-spacing:0.09em;}
.pres-section-sub{font-size:11px;color:var(--text-d);margin-top:1px;}
.pres-section-body{padding:0 16px 16px;}
.pres-lang-add{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:10px 12px;border:1.5px dashed var(--border);border-radius:8px;background:var(--white);font-size:12px;font-weight:600;color:var(--text-s);cursor:pointer;font-family:var(--font);letter-spacing:0.03em;transition:border-color .15s,color .15s;}
.pres-lang-add:hover{border-color:var(--bb400);color:var(--bb500);}
.pres-lang-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;}
.pres-chip{display:inline-flex;align-items:center;gap:5px;padding:5px 7px 5px 9px;border-radius:20px;font-size:12px;font-weight:500;border:1.5px solid var(--border);background:var(--white);color:var(--text-s);}
.pres-chip.active{background:var(--bb500);color:#fff;border-color:var(--bb500);}
.pres-chip-x{width:15px;height:15px;border-radius:50%;border:none;background:rgba(0,0,0,0.12);color:inherit;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:9px;padding:0;line-height:1;flex-shrink:0;}
.pres-chip.active .pres-chip-x{background:rgba(255,255,255,0.28);}
.pres-auto-row{display:flex;align-items:center;gap:10px;margin-top:14px;}
.pres-tog{width:38px;height:22px;border-radius:11px;background:var(--bb400);border:none;cursor:pointer;position:relative;flex-shrink:0;transition:background .15s;}
.pres-tog::after{content:'';width:16px;height:16px;border-radius:50%;background:#fff;position:absolute;top:3px;right:3px;box-shadow:0 1px 3px rgba(0,0,0,0.2);}
.pres-auto-label{font-size:12px;color:var(--text-s);flex:1;}
.pres-help{width:16px;height:16px;border-radius:50%;border:1.5px solid var(--border);background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.pres-participant{display:flex;align-items:center;justify-content:space-between;padding:8px 16px;border-bottom:1px solid var(--border-light);}
.pres-participant:last-child{border-bottom:none;}
.pres-participant-role{font-size:11px;color:var(--text-d);margin-bottom:1px;}
.pres-participant-name{font-size:13px;font-weight:600;color:var(--text-p);}
.pres-live-dot{width:10px;height:10px;border-radius:50%;background:var(--bb400);flex-shrink:0;animation:presLivePulse 2.2s ease-in-out infinite;}
@keyframes presLivePulse{0%,100%{box-shadow:0 0 0 0 rgba(1,124,255,0.4);}50%{box-shadow:0 0 0 5px rgba(1,124,255,0);}}

/* Presenter transcript (center) */
.pres-transcript{flex:1;display:flex;flex-direction:column;overflow:hidden;border-right:1px solid var(--border-light);background:var(--g50);}
.pres-scroll{flex:1;overflow-y:auto;padding:20px 20px 24px;}
.pres-scroll::-webkit-scrollbar{width:4px;}
.pres-scroll::-webkit-scrollbar-thumb{background:var(--g200);border-radius:2px;}
.pres-speaker-row{font-size:13px;font-weight:600;color:var(--text-p);margin:16px 0 6px;padding-left:2px;}
.pres-speaker-row:first-child{margin-top:0;}
.pres-bubble-row{display:flex;align-items:center;gap:8px;margin-bottom:5px;}
.pres-bubble{background:var(--white);border-radius:8px;padding:12px 14px;font-size:15px;line-height:1.5;color:var(--text-p);border-left:3px solid transparent;transition:border-color .25s;flex:1;min-width:0;}
.pres-bubble.has-eng{border-left-color:var(--bb300);}
.pres-bubble.has-q{border-left-color:#f59e0b !important;background:#fffdf5;}
.pres-bubble-footer{display:none;flex-direction:column;align-items:flex-start;gap:4px;flex-shrink:0;}
.pres-hl-badge{display:inline-flex;align-items:center;gap:3px;font-size:11px;font-weight:600;color:var(--bb600);background:var(--bb25);border:1px solid var(--bb100);border-radius:10px;padding:2px 8px;}
.pres-q-badge{display:inline-flex;align-items:center;gap:3px;font-size:11px;font-weight:600;color:#92400e;background:#fef3c7;border:1px solid #fde68a;border-radius:10px;padding:2px 8px;}

/* Engagement panel (right) */
.pres-ep{width:280px;display:flex;flex-direction:column;background:var(--white);flex-shrink:0;overflow:hidden;}
.pres-ep-hdr{padding:12px 14px 11px;border-bottom:1px solid var(--border-light);flex-shrink:0;}
.pres-ep-title-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:3px;}
.pres-ep-title{font-size:13px;font-weight:600;color:var(--text-p);}
.pres-ep-live{display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:600;color:var(--success-text);background:var(--success-bg);border:1px solid var(--success-border);border-radius:4px;padding:2px 6px;}
.pres-ep-live-dot{width:5px;height:5px;border-radius:50%;background:var(--success-text);animation:presLivePulse 1.5s ease-in-out infinite;}
.pres-ep-totals{font-size:11px;color:var(--text-d);}
.pres-ep-scroll{flex:1;overflow-y:auto;padding:10px 12px;display:flex;flex-direction:column;gap:10px;min-height:0;}
.pres-ep-scroll::-webkit-scrollbar{width:3px;}
.pres-ep-scroll::-webkit-scrollbar-thumb{background:var(--g200);border-radius:2px;}
.pres-ep-sec-title{font-size:10px;font-weight:700;color:var(--text-s);text-transform:uppercase;letter-spacing:0.07em;margin-bottom:6px;display:flex;align-items:center;gap:5px;}
.ep-q-item{background:#fffbf0;border:1px solid #fde68a;border-left:3px solid #f59e0b;border-radius:8px;padding:8px 10px;margin-bottom:5px;animation:hlIn .2s ease-out;}
.ep-q-tag{display:inline-flex;align-items:center;font-size:10px;font-weight:700;color:#92400e;background:#fef3c7;border:1px solid #fde68a;border-radius:8px;padding:1px 7px;margin-bottom:4px;}
.ep-q-text{font-size:12px;line-height:1.45;color:var(--text-p);}
.ep-hl-item{background:var(--bb25);border:1px solid var(--bb100);border-left:3px solid var(--bb400);border-radius:8px;padding:8px 10px;margin-bottom:5px;animation:hlIn .2s ease-out;}
.ep-hl-tag{display:inline-flex;align-items:center;font-size:10px;font-weight:700;color:var(--bb600);background:var(--bb50);border:1px solid var(--bb100);border-radius:8px;padding:1px 7px;margin-bottom:4px;}
.ep-hl-text{font-size:12px;line-height:1.45;color:var(--text-p);}
.ep-bar-wrap{height:3px;background:var(--bb100);border-radius:2px;margin-top:6px;overflow:hidden;}
.ep-bar{height:100%;border-radius:2px;background:var(--bb400);}
.ep-empty{font-size:12px;color:var(--text-d);font-style:italic;}
</style>
</head>
<body>

<!-- JOIN OVERLAY -->
<div class="join-overlay" id="join-overlay">
  <div class="join-card">
    <div class="join-card-header">
      <svg class="join-logo" viewBox="0 0 344 103" fill="none" aria-label="Wordly">
        <path d="M111.799 16.044L115.707 1.16055H108.879C98.2628 1.16055 88.9673 8.33555 86.2734 18.6046L77.7914 51.0388L65.3885 1.14722H50.0249L37.6887 50.8387L29.2468 18.6046C26.5662 8.33555 17.2707 1.16055 6.65488 1.16055H0L3.90757 16.044H6.65488C10.5091 16.044 13.8832 18.6446 14.8568 22.3788L27.9531 72.6971H45.2372L57.7201 24.686L70.2029 72.6971H87.487L100.677 22.3788C101.65 18.6579 105.024 16.044 108.879 16.044H111.799Z" fill="#017CFF"/>
        <path d="M167.252 43.6633V72.6834H182.135V43.6633C182.135 38.3954 186.43 34.1011 191.698 34.1011H198.446L202.34 19.2177H191.698C178.214 19.2177 167.252 30.1802 167.252 43.6633Z" fill="#017CFF"/>
        <path d="M146.795 22.6578C142.567 20.284 137.859 19.1104 132.685 19.1104C127.51 19.1104 122.776 20.2973 118.522 22.6578C114.267 25.0317 110.867 28.2591 108.346 32.3534C105.812 36.4477 104.558 41.1555 104.558 46.4634C104.558 51.7713 105.825 56.399 108.346 60.5333C110.88 64.6676 114.267 67.9083 118.522 70.2822C122.776 72.6561 127.497 73.8297 132.685 73.8297C137.873 73.8297 142.581 72.6428 146.795 70.2822C151.023 67.9083 154.397 64.6676 156.931 60.5333C159.464 56.399 160.718 51.7179 160.718 46.4634C160.718 41.2088 159.451 36.4477 156.931 32.3534C154.397 28.2591 151.023 25.0184 146.795 22.6578ZM144.154 53.9584C143.034 56.1323 141.5 57.826 139.54 59.0529C137.593 60.2666 135.299 60.88 132.672 60.88C130.044 60.88 127.737 60.2666 125.763 59.0529C123.776 57.8393 122.229 56.1456 121.109 53.9584C119.989 51.7846 119.429 49.2907 119.429 46.4634C119.429 43.636 119.989 41.1688 121.109 39.0216C122.229 36.8745 123.776 35.1807 125.763 33.9271C127.75 32.6735 130.044 32.06 132.672 32.06C135.299 32.06 137.579 32.6868 139.54 33.9271C141.487 35.1807 143.034 36.8745 144.154 39.0216C145.275 41.1688 145.835 43.6494 145.835 46.4634C145.835 49.2773 145.275 51.7846 144.154 53.9584Z" fill="#017CFF"/>
        <path d="M244.563 24.7261C243.189 23.3524 241.589 22.1788 239.708 21.272C236.734 19.8316 233.32 19.1115 229.479 19.1115C224.491 19.1115 219.97 20.3251 215.943 22.7656C211.915 25.1929 208.714 28.4736 206.341 32.6079C203.967 36.7422 202.793 41.3566 202.793 46.4778C202.793 51.599 203.967 56.1467 206.301 60.3077C208.634 64.4687 211.822 67.7627 215.849 70.2033C219.877 72.6305 224.465 73.8575 229.586 73.8575C233.173 73.8575 236.494 73.204 239.575 71.8837C241.936 70.8701 243.923 69.4831 245.523 67.7361V72.7106H258.966V0H244.563V24.7261ZM242.869 53.9595C241.749 56.1334 240.202 57.8271 238.215 59.0541C236.228 60.2677 233.92 60.8812 231.306 60.8812C228.692 60.8812 226.332 60.2677 224.251 59.0541C222.171 57.8404 220.557 56.1467 219.397 53.9595C218.25 51.7857 217.663 49.2918 217.663 46.4645C217.663 43.6372 218.237 41.1699 219.397 39.0228C220.544 36.8756 222.171 35.1819 224.251 33.9282C226.332 32.6746 228.679 32.0611 231.306 32.0611C233.934 32.0611 236.241 32.6746 238.215 33.8882C240.202 35.1018 241.749 36.7956 242.869 38.9827C243.989 41.1566 244.549 43.6505 244.549 46.4778C244.549 49.3051 243.989 51.799 242.869 53.9729V53.9595Z" fill="#017CFF"/>
        <path d="M281.87 0H267.466V72.6839H281.87V0Z" fill="#017CFF"/>
        <path d="M343.898 20.2572H328.441L318.292 47.8903C317.465 49.7707 316.678 51.6645 315.905 53.5716L303.675 20.2572H288.218L308.783 72.4293C307.223 76.6836 305.356 81.138 303.062 83.4719C296.9 91.3804 282.244 90.9669 281.923 79.3242H267.587C267.32 90.3268 275.789 100.396 286.565 102.356C301.941 105.65 315.691 94.4211 320.306 80.5512L343.898 20.2572Z" fill="#017CFF"/>
      </svg>
      <div class="join-title">Join a session</div>
      <div class="join-subtitle">Enter the session code shown by your presenter to start receiving live translation.</div>
    </div>
    <div class="join-divider"></div>
    <div class="join-card-body">
      <div class="join-field">
        <label class="join-label" for="join-code">Session code</label>
        <input class="join-input" id="join-code" type="text" placeholder="XXXX-0000" maxlength="9" autocomplete="off" autocapitalize="characters" spellcheck="false">
      </div>
      <div class="join-field">
        <label class="join-label" for="join-lang">Language</label>
        <select class="join-select" id="join-lang">
          <optgroup label="English">
            <option value="en">English (US)</option>
            <option value="en-GB">English (UK)</option>
            <option value="en-AU">English (AU)</option>
          </optgroup>
          <optgroup label="Common languages">
            <option value="ar">Arabic</option>
            <option value="zh-CN">Chinese (Simplified)</option>
            <option value="zh-TW">Chinese (Traditional)</option>
            <option value="zh-HK">Cantonese</option>
            <option value="nl">Dutch</option>
            <option value="fr">French</option>
            <option value="fr-CA">French (Canada)</option>
            <option value="de">German</option>
            <option value="hi">Hindi</option>
            <option value="id">Indonesian</option>
            <option value="it">Italian</option>
            <option value="ja">Japanese</option>
            <option value="ko">Korean</option>
            <option value="ms">Malay</option>
            <option value="pl">Polish</option>
            <option value="pt-BR">Portuguese (Brazil)</option>
            <option value="pt">Portuguese (Portugal)</option>
            <option value="ru">Russian</option>
            <option value="es">Spanish</option>
            <option value="es-MX">Spanish (Latin America)</option>
            <option value="sw">Swahili</option>
            <option value="tl">Tagalog</option>
            <option value="ta">Tamil</option>
            <option value="th">Thai</option>
            <option value="tr">Turkish</option>
            <option value="uk">Ukrainian</option>
            <option value="ur">Urdu</option>
            <option value="vi">Vietnamese</option>
          </optgroup>
          <optgroup label="Other languages">
            <option value="af">Afrikaans</option>
            <option value="sq">Albanian</option>
            <option value="hy">Armenian</option>
            <option value="bn">Bengali</option>
            <option value="bs">Bosnian</option>
            <option value="bg">Bulgarian</option>
            <option value="ca">Catalan</option>
            <option value="hr">Croatian</option>
            <option value="cs">Czech</option>
            <option value="da">Danish</option>
            <option value="et">Estonian</option>
            <option value="fi">Finnish</option>
            <option value="ka">Georgian</option>
            <option value="el">Greek</option>
            <option value="gu">Gujarati</option>
            <option value="ht">Haitian Creole</option>
            <option value="he">Hebrew</option>
            <option value="hu">Hungarian</option>
            <option value="is">Icelandic</option>
            <option value="ga">Irish</option>
            <option value="kn">Kannada</option>
            <option value="lv">Latvian</option>
            <option value="lo">Lao</option>
            <option value="lt">Lithuanian</option>
            <option value="mk">Macedonian</option>
            <option value="mt">Maltese</option>
            <option value="no">Norwegian</option>
            <option value="fa">Persian</option>
            <option value="pa">Punjabi</option>
            <option value="ro">Romanian</option>
            <option value="sr">Serbian</option>
            <option value="sk">Slovak</option>
            <option value="sl">Slovenian</option>
            <option value="sv">Swedish</option>
            <option value="cy">Welsh</option>
            <option value="zu">Zulu</option>
          </optgroup>
        </select>
      </div>
      <div class="join-field">
        <label class="join-label" for="join-name">Your name <span style="font-weight:400;color:var(--text-d);">(optional)</span></label>
        <input class="join-input" id="join-name" type="text" placeholder="e.g. Alex Kim" autocomplete="name">
      </div>
      <div class="join-error-msg" id="join-error"></div>
      <button class="join-btn" id="join-btn" onclick="joinSession()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
        Join session
      </button>
      <div class="join-demo-row">
        <span class="join-demo-label">No code?</span>
        <button class="join-demo-link" onclick="startDemo()">Try the demo instead</button>
      </div>
    </div>
  </div>
</div>

<!-- BUBBLE REACTION POPOVER -->
<div class="bubble-popover hidden" id="bubble-popover" role="menu" aria-label="React and save highlight"></div>

<div class="frame">

  <!-- TOP NAV -->
  <div class="attend-top-nav">
    <svg class="wordmark" viewBox="0 0 344 103" fill="none" aria-label="Wordly">
      <path d="M111.799 16.044L115.707 1.16055H108.879C98.2628 1.16055 88.9673 8.33555 86.2734 18.6046L77.7914 51.0388L65.3885 1.14722H50.0249L37.6887 50.8387L29.2468 18.6046C26.5662 8.33555 17.2707 1.16055 6.65488 1.16055H0L3.90757 16.044H6.65488C10.5091 16.044 13.8832 18.6446 14.8568 22.3788L27.9531 72.6971H45.2372L57.7201 24.686L70.2029 72.6971H87.487L100.677 22.3788C101.65 18.6579 105.024 16.044 108.879 16.044H111.799Z" fill="#017CFF"/>
      <path d="M167.252 43.6633V72.6834H182.135V43.6633C182.135 38.3954 186.43 34.1011 191.698 34.1011H198.446L202.34 19.2177H191.698C178.214 19.2177 167.252 30.1802 167.252 43.6633Z" fill="#017CFF"/>
      <path d="M146.795 22.6578C142.567 20.284 137.859 19.1104 132.685 19.1104C127.51 19.1104 122.776 20.2973 118.522 22.6578C114.267 25.0317 110.867 28.2591 108.346 32.3534C105.812 36.4477 104.558 41.1555 104.558 46.4634C104.558 51.7713 105.825 56.399 108.346 60.5333C110.88 64.6676 114.267 67.9083 118.522 70.2822C122.776 72.6561 127.497 73.8297 132.685 73.8297C137.873 73.8297 142.581 72.6428 146.795 70.2822C151.023 67.9083 154.397 64.6676 156.931 60.5333C159.464 56.399 160.718 51.7179 160.718 46.4634C160.718 41.2088 159.451 36.4477 156.931 32.3534C154.397 28.2591 151.023 25.0184 146.795 22.6578ZM144.154 53.9584C143.034 56.1323 141.5 57.826 139.54 59.0529C137.593 60.2666 135.299 60.88 132.672 60.88C130.044 60.88 127.737 60.2666 125.763 59.0529C123.776 57.8393 122.229 56.1456 121.109 53.9584C119.989 51.7846 119.429 49.2907 119.429 46.4634C119.429 43.636 119.989 41.1688 121.109 39.0216C122.229 36.8745 123.776 35.1807 125.763 33.9271C127.75 32.6735 130.044 32.06 132.672 32.06C135.299 32.06 137.579 32.6868 139.54 33.9271C141.487 35.1807 143.034 36.8745 144.154 39.0216C145.275 41.1688 145.835 43.6494 145.835 46.4634C145.835 49.2773 145.275 51.7846 144.154 53.9584Z" fill="#017CFF"/>
      <path d="M244.563 24.7261C243.189 23.3524 241.589 22.1788 239.708 21.272C236.734 19.8316 233.32 19.1115 229.479 19.1115C224.491 19.1115 219.97 20.3251 215.943 22.7656C211.915 25.1929 208.714 28.4736 206.341 32.6079C203.967 36.7422 202.793 41.3566 202.793 46.4778C202.793 51.599 203.967 56.1467 206.301 60.3077C208.634 64.4687 211.822 67.7627 215.849 70.2033C219.877 72.6305 224.465 73.8575 229.586 73.8575C233.173 73.8575 236.494 73.204 239.575 71.8837C241.936 70.8701 243.923 69.4831 245.523 67.7361V72.7106H258.966V0H244.563V24.7261ZM242.869 53.9595C241.749 56.1334 240.202 57.8271 238.215 59.0541C236.228 60.2677 233.92 60.8812 231.306 60.8812C228.692 60.8812 226.332 60.2677 224.251 59.0541C222.171 57.8404 220.557 56.1467 219.397 53.9595C218.25 51.7857 217.663 49.2918 217.663 46.4645C217.663 43.6372 218.237 41.1699 219.397 39.0228C220.544 36.8756 222.171 35.1819 224.251 33.9282C226.332 32.6746 228.679 32.0611 231.306 32.0611C233.934 32.0611 236.241 32.6746 238.215 33.8882C240.202 35.1018 241.749 36.7956 242.869 38.9827C243.989 41.1566 244.549 43.6505 244.549 46.4778C244.549 49.3051 243.989 51.799 242.869 53.9729V53.9595Z" fill="#017CFF"/>
      <path d="M281.87 0H267.466V72.6839H281.87V0Z" fill="#017CFF"/>
      <path d="M343.898 20.2572H328.441L318.292 47.8903C317.465 49.7707 316.678 51.6645 315.905 53.5716L303.675 20.2572H288.218L308.783 72.4293C307.223 76.6836 305.356 81.138 303.062 83.4719C296.9 91.3804 282.244 90.9669 281.923 79.3242H267.587C267.32 90.3268 275.789 100.396 286.565 102.356C301.941 105.65 315.691 94.4211 320.306 80.5512L343.898 20.2572Z" fill="#017CFF"/>
    </svg>
    <div class="nav-right">
      <div class="view-toggle">
        <button class="vt-btn active" id="btn-attendee" onclick="showView('attendee')">Attend</button>
        <button class="vt-btn" id="btn-presenter" onclick="showView('presenter')">Present</button>
        <button class="vt-btn" id="btn-ended" onclick="showView('ended')">Session ended</button>
        <button class="vt-btn" id="btn-organizer" onclick="showView('organizer')">Portal usage page</button>
        <button class="vt-btn" id="btn-public" onclick="showView('public')">Public summary page</button>
      </div>
      <div class="nav-hamburger" aria-label="Menu"><span></span><span></span><span></span></div>
    </div>
  </div>

  <!-- SUB NAV -->
  <div class="sub-nav" id="attend-subnav">
    <div style="display:flex;align-items:center;gap:8px;">
      <span class="session-id-text" id="session-id-display">—</span>
      <div class="conn-status demo" id="conn-status-pill"><div class="conn-dot"></div><span id="conn-status-text">Demo</span></div>
    </div>
    <div class="sub-nav-right">
      <button class="icon-btn" id="subnav-audio-btn" aria-label="Mute">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
      </button>
      <button class="lang-selector" id="lang-selector-btn" onclick="toggleLangPicker(event)" aria-haspopup="listbox" aria-expanded="false">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        ENGLISH (US)
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <button class="icon-btn" id="subnav-exit-btn" aria-label="Exit" title="Leave session" style="color:#b8221a;" onclick="exitSession()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      </button>
    </div>
    <!-- Language picker popover -->
    <div class="lang-popover hidden" id="lang-popover" role="listbox" aria-labelledby="lang-selector-btn"></div>
  </div>

  <div class="main" id="main-area">

    <!-- ATTENDEE VIEW -->
    <div id="view-attendee" style="display:flex;width:100%;overflow:hidden;min-height:0;position:relative;">
      <div class="transcript-col">
        <div class="transcript-scroll" id="transcript-scroll">
          <div id="transcript-body"></div>
        </div>
      </div>
      <div class="highlights-col">
        <div class="hlp-header">
          <div class="hlp-title" id="hlp-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 11L3 17V20H12L15 17" stroke="#646e78" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 12l-4.6 4.6a2 2 0 01-2.8 0l-5.2-5.2a2 2 0 010-2.8L14 4" stroke="#646e78" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            My highlights
            <span class="hlp-count" id="hl-count-desktop">0</span>
          </div>
          <button class="hlp-collapse-btn" id="hlp-collapse-btn" onclick="toggleHLPanel()" title="Collapse panel">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
        </div>
        <div class="hlp-scroll" id="hlp-scroll-desktop">
          <div class="hlp-empty" id="hlp-empty-desktop">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M9 11L3 17V20H12L15 17" stroke="#cdd2d7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 12l-4.6 4.6a2 2 0 01-2.8 0l-5.2-5.2a2 2 0 010-2.8L14 4" stroke="#cdd2d7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <p class="hlp-empty-text">Click on a speech bubble and pick a reaction to save it to your highlights.</p>
          </div>
        </div>
        <div class="hlp-footer" id="hlp-footer-desktop" style="display:none;">
          <div id="email-section-desktop" style="display:none;">
            <div style="font-size:11px;color:var(--text-s);font-weight:500;margin-bottom:6px;">Send highlights to</div>
            <input class="email-input" type="email" placeholder="your@email.com" style="margin-bottom:8px;">
          </div>
          <button class="btn-primary-sm" onclick="copyHighlights(this)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
            Copy highlights
          </button>
          <button class="btn-secondary-sm" onclick="toggleEmail()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14" style="margin-right:5px;vertical-align:-2px"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            Email highlights
          </button>
        </div>
      </div>

      <!-- Mobile FAB -->
      <button class="fab" id="fab" onclick="fabClick()" aria-label="My highlights">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M9 11L3 17V20H12L15 17" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 12l-4.6 4.6a2 2 0 01-2.8 0l-5.2-5.2a2 2 0 010-2.8L14 4" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span class="fab-badge" id="fab-badge">0</span>
      </button>

      <!-- Mobile bottom sheet -->
      <div class="bottom-sheet-overlay" id="bs-overlay" onclick="closeSheet()">
        <div class="bottom-sheet" id="bottom-sheet" onclick="event.stopPropagation()">
          <div class="bs-handle"></div>
          <div class="bs-header">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 11L3 17V20H12L15 17" stroke="#0063cc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 12l-4.6 4.6a2 2 0 01-2.8 0l-5.2-5.2a2 2 0 010-2.8L14 4" stroke="#0063cc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span class="bs-title">My Highlights</span>
            <button class="bs-close" onclick="closeSheet()" aria-label="Close">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="bs-scroll" id="bs-scroll">
            <div class="bs-empty" id="bs-empty">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="M9 11L3 17V20H12L15 17" stroke="#cdd2d7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 12l-4.6 4.6a2 2 0 01-2.8 0l-5.2-5.2a2 2 0 010-2.8L14 4" stroke="#cdd2d7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <p class="bs-empty-text">Tap a speech bubble and pick a reaction to save it to your highlights.</p>
            </div>
          </div>
          <div class="bs-footer">
            <button class="bs-cta" onclick="copyBsHighlights(this)">Copy My Highlights</button>
            <div id="bs-email-wrap" style="margin-top:10px;display:none;">
              <input class="bs-email-input" id="bs-email-input" type="email" placeholder="your@email.com">
              <button class="bs-cta" style="margin-top:8px;" onclick="sendBsHighlights(this)">Send</button>
            </div>
            <button class="bs-cta-secondary" onclick="toggleSendEmail('bs-email-wrap','bs-send-btn')" id="bs-send-btn" style="margin-top:10px;">Send Highlights</button>
          </div>
        </div>
      </div>
    </div>

    <!-- PRESENTER VIEW -->
    <div id="view-presenter" style="display:none;width:100%;overflow:hidden;">
      <div class="pres-wrap">

        <!-- Left: Language Controls + Participants -->
        <div class="pres-left">

          <!-- Language Controls -->
          <div class="pres-section">
            <div class="pres-section-hdr" onclick="togglePresSection('lang')">
              <div>
                <div class="pres-section-name">LANGUAGE CONTROLS</div>
              </div>
              <svg id="pres-lang-chev" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="flex-shrink:0;transition:transform .2s;"><polyline points="18 15 12 9 6 15"/></svg>
            </div>
            <div class="pres-section-body" id="pres-lang-body">
              <button class="pres-lang-add">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
                + ADD A LANGUAGE
              </button>
              <div class="pres-lang-chips">
                <div class="pres-chip active">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 2L9.09 8.26L2 9.27L7 14.14L5.82 21.02L12 17.77L18.18 21.02L17 14.14L22 9.27L14.91 8.26L12 2Z" fill="#fff" stroke="none"/></svg>
                  English (US)
                  <button class="pres-chip-x" aria-label="Remove">×</button>
                </div>
                <div class="pres-chip">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 2L9.09 8.26L2 9.27L7 14.14L5.82 21.02L12 17.77L18.18 21.02L17 14.14L22 9.27L14.91 8.26L12 2Z" fill="var(--g400)" stroke="none"/></svg>
                  French (FR)
                  <button class="pres-chip-x" aria-label="Remove">×</button>
                </div>
                <div class="pres-chip">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 2L9.09 8.26L2 9.27L7 14.14L5.82 21.02L12 17.77L18.18 21.02L17 14.14L22 9.27L14.91 8.26L12 2Z" fill="var(--g400)" stroke="none"/></svg>
                  Spanish (ES)
                  <button class="pres-chip-x" aria-label="Remove">×</button>
                </div>
              </div>
              <div class="pres-auto-row">
                <button class="pres-tog" aria-label="Automatic language selection on"></button>
                <span class="pres-auto-label">Automatic language selection</span>
                <div class="pres-help"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>
              </div>
            </div>
          </div>

          <!-- Participants -->
          <div class="pres-section">
            <div class="pres-section-hdr" onclick="togglePresSection('participants')">
              <div>
                <div class="pres-section-name">PARTICIPANTS</div>
                <div class="pres-section-sub" id="pres-attendee-count">247 attendees</div>
              </div>
              <svg id="pres-participants-chev" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="flex-shrink:0;transition:transform .2s;"><polyline points="18 15 12 9 6 15"/></svg>
            </div>
            <div id="pres-participants-body">
              <div class="pres-participant">
                <div>
                  <div class="pres-participant-role">Presenter</div>
                  <div class="pres-participant-name">Lenny Rachitsky</div>
                </div>
                <div class="pres-live-dot"></div>
              </div>
              <div class="pres-participant">
                <div>
                  <div class="pres-participant-role">Presenter</div>
                  <div class="pres-participant-name">Simon Willison</div>
                </div>
                <div class="pres-live-dot"></div>
              </div>
            </div>
          </div>

        </div>

        <!-- Center: Transcript feed -->
        <div class="pres-transcript">
          <div class="pres-scroll" id="pres-scroll">
            <div id="pres-body"></div>
          </div>
        </div>

        <!-- Right: Live Engagement Panel -->
        <div class="pres-ep">
          <div class="pres-ep-hdr">
            <div class="pres-ep-title-row">
              <span class="pres-ep-title">Live Engagement</span>
              <span class="pres-ep-live"><span id="pres-ep-live-dot" class="pres-ep-live-dot"></span>Live</span>
            </div>
            <div class="pres-ep-totals" id="ep-total"></div>
          </div>
          <div class="pres-ep-scroll" id="pres-ep-scroll">
            <!-- Questions section -->
            <div id="ep-q-section">
              <div class="pres-ep-sec-title">
                <span>❓</span> Questions from attendees
              </div>
              <div id="ep-q-list"></div>
            </div>
            <div class="divider" id="ep-divider"></div>
            <!-- Highlights section -->
            <div id="ep-hl-section">
              <div class="pres-ep-sec-title">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M9 11L3 17V20H12L15 17" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 12l-4.6 4.6a2 2 0 01-2.8 0l-5.2-5.2a2 2 0 010-2.8L14 4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                Most highlighted
              </div>
              <div id="ep-hl-list"><div class="ep-empty">No highlights yet</div></div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- ORGANIZER VIEW -->
    <div id="view-organizer" style="display:none;width:100%;overflow:hidden;">
      <div style="display:flex;width:100%;height:100%;overflow:hidden;">

        <!-- Side nav — matches screenshot exactly -->
        <div style="width:180px;background:var(--white);border-right:1px solid var(--border-light);display:flex;flex-direction:column;flex-shrink:0;overflow-y:auto;">
          <div style="padding:8px 0;">
            <div class="portal-nav-item"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>Dashboard</div>
            <div class="portal-nav-item"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>Sessions</div>
            <div class="portal-nav-item active"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>Activity</div>
            <div class="portal-nav-item"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>Transcripts</div>
            <div class="portal-nav-item"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3"/><path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3"/><line x1="12" y1="20" x2="12" y2="4"/><polyline points="8 8 4 12 8 16"/><polyline points="16 8 20 12 16 16"/></svg>Transactions</div>
            <div class="portal-nav-item"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/><path d="m5 11 2-2 2 2"/><path d="m15 11 2 2 2-2"/></svg>Glossaries</div>
            <div class="portal-nav-item"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>Accounts</div>
            <div class="portal-nav-item"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>Purchase</div>
            <div class="portal-nav-item"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.11 13 19.79 19.79 0 0 1 1.08 4.38 2 2 0 0 1 3.05 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>Support</div>
            <div class="portal-nav-item"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>Users</div>
            <div class="portal-nav-item"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>Alerts</div>
            <div style="height:1px;background:var(--border-light);margin:8px 12px;"></div>
            <div class="portal-nav-item"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>All Accounts</div>
            <div class="portal-nav-item"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>All Sessions</div>
            <div class="portal-nav-item"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>Usage</div>
            <div class="portal-nav-item"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>Find</div>
            <div class="portal-nav-item"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3a2 2 0 0 0-2 2"/><path d="M19 3a2 2 0 0 1 2 2"/><path d="M21 19a2 2 0 0 1-2 2"/><path d="M5 21a2 2 0 0 1-2-2"/><path d="M9 3h1"/><path d="M9 21h1"/><path d="M14 3h1"/><path d="M14 21h1"/><path d="M3 9v1"/><path d="M21 9v1"/><path d="M3 14v1"/><path d="M21 14v1"/></svg>Future</div>
          </div>
        </div>

        <!-- Session list -->
        <div class="session-list">
          <div class="session-list-header">
            <div class="session-list-title">Activity</div>
            <div class="session-search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" placeholder="Search sessions…">
            </div>
          </div>
          <div class="session-list-scroll">
            <div class="session-item active">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
                <div class="session-item-id">SWAI-0402</div>
                <div class="session-item-meta" style="margin:0;"><span class="session-badge highlights"><svg width="9" height="9" viewBox="0 0 24 24" fill="none"><path d="M9 11L3 17V20H12L15 17" stroke="#0051a8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 12l-4.6 4.6a2 2 0 01-2.8 0l-5.2-5.2a2 2 0 010-2.8L14 4" stroke="#0051a8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>2,241</span></div>
              </div>
              <div class="session-item-date">Apr 2, 2026 · 10:00 AM</div>
              <div style="display:flex;gap:12px;margin-top:4px;">
                <span style="font-size:11px;color:var(--text-s);">78 mins</span>
                <span style="font-size:11px;color:var(--text-s);">247 attendees</span>
                <span class="session-badge completed" style="margin:0;">Completed</span>
              </div>
            </div>
            <div class="session-item">
              <div class="session-item-id">MXQR-4422</div>
              <div class="session-item-date">May 8, 2026 · 2:00 PM</div>
              <div style="display:flex;gap:12px;margin-top:4px;">
                <span style="font-size:11px;color:var(--text-s);">312 mins</span>
                <span style="font-size:11px;color:var(--text-s);">84 attendees</span>
                <span class="session-badge completed" style="margin:0;">Completed</span>
              </div>
            </div>
            <div class="session-item">
              <div class="session-item-id">PLDK-9901</div>
              <div class="session-item-date">May 7, 2026 · 10:30 AM</div>
              <div style="display:flex;gap:12px;margin-top:4px;">
                <span style="font-size:11px;color:var(--text-s);">540 mins</span>
                <span style="font-size:11px;color:var(--text-s);">136 attendees</span>
                <span class="session-badge completed" style="margin:0;">Completed</span>
              </div>
            </div>
            <div class="session-item">
              <div class="session-item-id">BWRN-1155</div>
              <div class="session-item-date">May 5, 2026 · 3:00 PM</div>
              <div style="display:flex;gap:12px;margin-top:4px;">
                <span style="font-size:11px;color:var(--text-s);">180 mins</span>
                <span style="font-size:11px;color:var(--text-s);">52 attendees</span>
                <span class="session-badge completed" style="margin:0;">Completed</span>
              </div>
            </div>
            <div class="session-item">
              <div class="session-item-id">ZQTF-7823</div>
              <div class="session-item-date">May 2, 2026 · 9:00 AM</div>
              <div style="display:flex;gap:12px;margin-top:4px;">
                <span style="font-size:11px;color:var(--text-s);">624 mins</span>
                <span style="font-size:11px;color:var(--text-s);">198 attendees</span>
                <span class="session-badge completed" style="margin:0;">Completed</span>
              </div>
            </div>
            <div class="session-item">
              <div class="session-item-id">HNCV-3310</div>
              <div class="session-item-date">Apr 29, 2026 · 1:00 PM</div>
              <div style="display:flex;gap:12px;margin-top:4px;">
                <span style="font-size:11px;color:var(--text-s);">288 mins</span>
                <span style="font-size:11px;color:var(--text-s);">71 attendees</span>
                <span class="session-badge completed" style="margin:0;">Completed</span>
              </div>
            </div>
          </div>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;overflow:hidden;background:var(--g50);">
          <div class="detail-header" style="flex-shrink:0;">
            <div>
              <div class="detail-session-id">SWAI-0402</div>
              <div class="detail-meta">
                <span class="detail-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>Apr 2, 2026</span>
                <span class="detail-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>10:00 AM – 11:18 AM PST</span>
                <span class="detail-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>247 attendees</span>
                <span style="background:var(--success-bg);color:var(--success-text);border:1px solid var(--success-border);border-radius:3px;padding:2px 6px;font-size:10px;font-weight:600;">Completed</span>
              </div>
            </div>
            <div class="detail-actions">
              <button class="detail-action-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>Transcript</button>
              <button class="detail-action-btn" onclick="showView('public')" style="color:var(--bb600);border-color:var(--bb200);background:var(--bb25);"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11L3 17V20H12L15 17"/><path d="M22 12l-4.6 4.6a2 2 0 01-2.8 0l-5.2-5.2a2 2 0 010-2.8L14 4"/></svg>Public summary</button>
              <button class="detail-action-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>Options</button>
            </div>
          </div>
          <div id="detail-body" style="flex:1;overflow-y:auto;padding:16px 20px;display:block;">
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px;">
                  <div class="card" style="margin-bottom:0;">
                    <div class="card-header"><div class="card-title"><div class="card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>Usage summary</div></div>
                    <div class="card-body">
                      <div class="usage-row"><span class="usage-label">Status</span><span class="usage-value" style="color:var(--success-text);">Completed</span></div>
                      <div class="usage-row"><span class="usage-label">Start time</span><span class="usage-value">10:00 AM PST</span></div>
                      <div class="usage-row"><span class="usage-label">Duration</span><span class="usage-value">1h 18m</span></div>
                      <div class="usage-row"><span class="usage-label">Minutes used</span><span class="usage-value">312</span></div>
                      <div class="usage-row"><span class="usage-label">Attendees</span><span class="usage-value">247</span></div>
                      <div class="usage-row"><span class="usage-label">Presenter language</span><span class="usage-value">English (US)</span></div>
                      <div class="usage-row"><span class="usage-label">Attendee languages</span><span class="usage-value">7 languages</span></div>
                    </div>
                  </div>
                  <div class="card" style="margin-bottom:0;">
                    <div class="card-header"><div class="card-title"><div class="card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg></div>Attendee languages</div><span style="font-size:11px;color:var(--text-d);">7 languages</span></div>
                    <div class="card-body" style="padding:16px;">
                      <div style="display:flex;flex-direction:column;gap:10px;">
                        <div class="lang-bar-row">
                          <div class="lang-bar-label"><span class="lang-bar-name">English</span><span class="lang-bar-count">112</span></div>
                          <div class="lang-bar-track"><div class="lang-bar-fill" style="width:45.3%;background:#e74c3c;"></div></div>
                        </div>
                        <div class="lang-bar-row">
                          <div class="lang-bar-label"><span class="lang-bar-name">Spanish</span><span class="lang-bar-count">48</span></div>
                          <div class="lang-bar-track"><div class="lang-bar-fill" style="width:19.4%;background:#4a90d9;"></div></div>
                        </div>
                        <div class="lang-bar-row">
                          <div class="lang-bar-label"><span class="lang-bar-name">Portuguese</span><span class="lang-bar-count">35</span></div>
                          <div class="lang-bar-track"><div class="lang-bar-fill" style="width:14.2%;background:#2ecc71;"></div></div>
                        </div>
                        <div class="lang-bar-row">
                          <div class="lang-bar-label"><span class="lang-bar-name">German</span><span class="lang-bar-count">22</span></div>
                          <div class="lang-bar-track"><div class="lang-bar-fill" style="width:8.9%;background:#f39c12;"></div></div>
                        </div>
                        <div class="lang-bar-row">
                          <div class="lang-bar-label"><span class="lang-bar-name">French</span><span class="lang-bar-count">16</span></div>
                          <div class="lang-bar-track"><div class="lang-bar-fill" style="width:6.5%;background:#9b59b6;"></div></div>
                        </div>
                        <div class="lang-bar-row">
                          <div class="lang-bar-label"><span class="lang-bar-name">Japanese</span><span class="lang-bar-count">9</span></div>
                          <div class="lang-bar-track"><div class="lang-bar-fill" style="width:3.6%;background:#e67e22;"></div></div>
                        </div>
                        <div class="lang-bar-row">
                          <div class="lang-bar-label"><span class="lang-bar-name">Korean</span><span class="lang-bar-count">5</span></div>
                          <div class="lang-bar-track"><div class="lang-bar-fill" style="width:2.0%;background:#1abc9c;"></div></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="engagement-card">
                  <div class="engagement-header">
                    <div class="engagement-icon"><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M9 11L3 17V20H12L15 17" stroke="#0063cc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 12l-4.6 4.6a2 2 0 01-2.8 0l-5.2-5.2a2 2 0 010-2.8L14 4" stroke="#0063cc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                    <span class="engagement-title">Audience engagement</span>
                    <span class="new-tag">NEW</span>
                  </div>
                  <div class="engagement-body">
                    <div class="eng-metrics">
                      <div class="eng-metric"><div class="eng-metric-label">Attendees who highlighted</div><div class="eng-metric-value">168</div><div class="eng-metric-sub">68% of attendees</div></div>
                      <div class="eng-metric"><div class="eng-metric-label">Total highlights</div><div class="eng-metric-value">2,241</div><div class="eng-metric-sub">Avg 13.3 per person</div></div>
                      <div class="eng-metric"><div class="eng-metric-label">Engagement</div><div class="eng-metric-value" style="font-size:16px;color:var(--success-text);font-weight:700;">High</div><div class="eng-metric-sub">Top 10% of sessions</div></div>
                    </div>
                    <div class="divider"></div>
                    <div>
                      <div class="moments-section-title" style="margin-bottom:10px;">Highlights over time</div>
                      <canvas id="hl-chart" height="90" style="width:100%;display:block;"></canvas>
                      <div style="display:flex;justify-content:space-between;margin-top:4px;">
                        <span style="font-size:10px;color:var(--text-d);">10:00 AM</span>
                        <span style="font-size:10px;color:var(--text-d);">10:26 AM</span>
                        <span style="font-size:10px;color:var(--text-d);">10:52 AM</span>
                        <span style="font-size:10px;color:var(--text-d);">11:18 AM</span>
                      </div>
                    </div>
                    <div class="divider"></div>
                    <div>
                      <div class="moments-section-title">Most-highlighted moments</div>
                      <div class="moment-item"><div class="moment-num n1">1</div><div class="moment-txt">Today, probably 95% of the code that I produce, I didn't type it myself. And I've been writing software for 25 years.</div><div class="moment-ct">156</div></div>
                      <div class="moment-item"><div class="moment-num n2">2</div><div class="moment-txt">Using coding agents well is taking every inch of my 25 years of experience as a software engineer. The agents don't know what they don't know.</div><div class="moment-ct">128</div></div>
                      <div class="moment-item"><div class="moment-num n3">3</div><div class="moment-txt">My prediction is that we're going to see a Challenger disaster — some very public, very embarrassing failure of an agentic system caused by prompt injection.</div><div class="moment-ct">104</div></div>
                    </div>
                    <div class="divider"></div>
                    <div>
                      <div class="moments-section-title">Audience reactions <span style="font-size:11px;font-weight:400;color:var(--text-d);margin-left:4px;">847 total</span></div>
                      <div class="react-breakdown-row">
                        <div class="react-stat"><span class="react-stat-emoji">👍</span><span class="react-stat-count">312</span><span class="react-stat-pct">37%</span></div>
                        <div class="react-stat"><span class="react-stat-emoji">❤️</span><span class="react-stat-count">248</span><span class="react-stat-pct">29%</span></div>
                        <div class="react-stat"><span class="react-stat-emoji">❓</span><span class="react-stat-count">167</span><span class="react-stat-pct">20%</span></div>
                        <div class="react-stat"><span class="react-stat-emoji">👎</span><span class="react-stat-count">120</span><span class="react-stat-pct">14%</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- PUBLIC SUMMARY VIEW -->
    <div id="view-public" style="display:none;position:absolute;inset:0;z-index:40;overflow-y:auto;background:#f8f9fa;">
      <!-- Wordly top bar with prototype toggle -->
      <div style="background:var(--white);border-bottom:1px solid var(--border-light);padding:10px 24px;display:flex;align-items:center;justify-content:space-between;">
        <svg height="20" viewBox="0 0 344 103" fill="none" aria-label="Wordly" style="flex-shrink:0;">
          <path d="M111.799 16.044L115.707 1.16055H108.879C98.2628 1.16055 88.9673 8.33555 86.2734 18.6046L77.7914 51.0388L65.3885 1.14722H50.0249L37.6887 50.8387L29.2468 18.6046C26.5662 8.33555 17.2707 1.16055 6.65488 1.16055H0L3.90757 16.044H6.65488C10.5091 16.044 13.8832 18.6446 14.8568 22.3788L27.9531 72.6971H45.2372L57.7201 24.686L70.2029 72.6971H87.487L100.677 22.3788C101.65 18.6579 105.024 16.044 108.879 16.044H111.799Z" fill="#017CFF"/>
          <path d="M167.252 43.6633V72.6834H182.135V43.6633C182.135 38.3954 186.43 34.1011 191.698 34.1011H198.446L202.34 19.2177H191.698C178.214 19.2177 167.252 30.1802 167.252 43.6633Z" fill="#017CFF"/>
          <path d="M146.795 22.6578C142.567 20.284 137.859 19.1104 132.685 19.1104C127.51 19.1104 122.776 20.2973 118.522 22.6578C114.267 25.0317 110.867 28.2591 108.346 32.3534C105.812 36.4477 104.558 41.1555 104.558 46.4634C104.558 51.7713 105.825 56.399 108.346 60.5333C110.88 64.6676 114.267 67.9083 118.522 70.2822C122.776 72.6561 127.497 73.8297 132.685 73.8297C137.873 73.8297 142.581 72.6428 146.795 70.2822C151.023 67.9083 154.397 64.6676 156.931 60.5333C159.464 56.399 160.718 51.7179 160.718 46.4634C160.718 41.2088 159.451 36.4477 156.931 32.3534C154.397 28.2591 151.023 25.0184 146.795 22.6578ZM144.154 53.9584C143.034 56.1323 141.5 57.826 139.54 59.0529C137.593 60.2666 135.299 60.88 132.672 60.88C130.044 60.88 127.737 60.2666 125.763 59.0529C123.776 57.8393 122.229 56.1456 121.109 53.9584C119.989 51.7846 119.429 49.2907 119.429 46.4634C119.429 43.636 119.989 41.1688 121.109 39.0216C122.229 36.8745 123.776 35.1807 125.763 33.9271C127.75 32.6735 130.044 32.06 132.672 32.06C135.299 32.06 137.579 32.6868 139.54 33.9271C141.487 35.1807 143.034 36.8745 144.154 39.0216C145.275 41.1688 145.835 43.6494 145.835 46.4634C145.835 49.2773 145.275 51.7846 144.154 53.9584Z" fill="#017CFF"/>
          <path d="M244.563 24.7261C243.189 23.3524 241.589 22.1788 239.708 21.272C236.734 19.8316 233.32 19.1115 229.479 19.1115C224.491 19.1115 219.97 20.3251 215.943 22.7656C211.915 25.1929 208.714 28.4736 206.341 32.6079C203.967 36.7422 202.793 41.3566 202.793 46.4778C202.793 51.599 203.967 56.1467 206.301 60.3077C208.634 64.4687 211.822 67.7627 215.849 70.2033C219.877 72.6305 224.465 73.8575 229.586 73.8575C233.173 73.8575 236.494 73.204 239.575 71.8837C241.936 70.8701 243.923 69.4831 245.523 67.7361V72.7106H258.966V0H244.563V24.7261ZM242.869 53.9595C241.749 56.1334 240.202 57.8271 238.215 59.0541C236.228 60.2677 233.92 60.8812 231.306 60.8812C228.692 60.8812 226.332 60.2677 224.251 59.0541C222.171 57.8404 220.557 56.1467 219.397 53.9595C218.25 51.7857 217.663 49.2918 217.663 46.4645C217.663 43.6372 218.237 41.1699 219.397 39.0228C220.544 36.8756 222.171 35.1819 224.251 33.9282C226.332 32.6746 228.679 32.0611 231.306 32.0611C233.934 32.0611 236.241 32.6746 238.215 33.8882C240.202 35.1018 241.749 36.7956 242.869 38.9827C243.989 41.1566 244.549 43.6505 244.549 46.4778C244.549 49.3051 243.989 51.799 242.869 53.9729V53.9595Z" fill="#017CFF"/>
          <path d="M281.87 0H267.466V72.6839H281.87V0Z" fill="#017CFF"/>
          <path d="M343.898 20.2572H328.441L318.292 47.8903C317.465 49.7707 316.678 51.6645 315.905 53.5716L303.675 20.2572H288.218L308.783 72.4293C307.223 76.6836 305.356 81.138 303.062 83.4719C296.9 91.3804 282.244 90.9669 281.923 79.3242H267.587C267.32 90.3268 275.789 100.396 286.565 102.356C301.941 105.65 315.691 94.4211 320.306 80.5512L343.898 20.2572Z" fill="#017CFF"/>
        </svg>
        <div class="view-toggle">
          <button class="vt-btn" onclick="showView('attendee')">Attend</button>
          <button class="vt-btn" onclick="showView('presenter')">Present</button>
          <button class="vt-btn" onclick="showView('ended')">Session ended</button>
          <button class="vt-btn" onclick="showView('organizer')">Portal usage page</button>
          <button class="vt-btn active" onclick="showView('public')">Public summary page</button>
        </div>
      </div>

      <!-- Page content -->
      <div style="max-width:680px;margin:0 auto;padding:32px 24px 64px;">

        <!-- Title + presenter -->
        <div style="text-align:center;margin-bottom:32px;">
          <h1 style="font-size:26px;font-weight:700;color:var(--text-p);line-height:1.3;margin-bottom:12px;">An AI State of the Union: We've Passed the Inflection Point</h1>
          <div style="display:flex;align-items:center;justify-content:center;gap:6px;color:var(--text-s);font-size:14px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Lenny Rachitsky &amp; Simon Willison · Lenny's Newsletter · April 2, 2026
          </div>
        </div>

        <!-- Featured quote -->
        <div style="background:var(--bb25);border:1.5px solid var(--bb100);border-radius:12px;padding:24px 28px;margin-bottom:24px;">
          <p style="font-size:17px;font-weight:600;line-height:1.55;color:var(--text-p);">&ldquo;Today, probably 95% of the code that I produce, I didn&rsquo;t type it myself. And I&rsquo;ve been writing software for 25 years. That number would have seemed completely absurd to me even eighteen months ago.&rdquo;</p>
          <p style="font-size:12px;color:var(--text-s);margin-top:10px;">&mdash; Simon Willison</p>
        </div>

        <!-- Key Takeaways -->
        <div style="background:var(--white);border:1px solid var(--border-light);border-radius:12px;padding:24px 28px;margin-bottom:16px;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:20px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0063cc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span style="font-size:15px;font-weight:700;color:var(--text-p);">Key Takeaways</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:14px;">
            <div style="display:flex;align-items:flex-start;gap:12px;">
              <div style="width:24px;height:24px;border-radius:50%;background:var(--bb100);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:var(--bb600);flex-shrink:0;">1</div>
              <span style="font-size:14px;line-height:1.5;color:var(--text-p);padding-top:3px;">November 2025 was the inflection point — AI coding agents crossed from "mostly works" to "actually works," and the pace of change accelerated sharply</span>
            </div>
            <div style="display:flex;align-items:flex-start;gap:12px;">
              <div style="width:24px;height:24px;border-radius:50%;background:var(--bb100);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:var(--bb600);flex-shrink:0;">2</div>
              <span style="font-size:14px;line-height:1.5;color:var(--text-p);padding-top:3px;">Coding agents don't reduce the need for experience — using them well requires every bit of seniority you have to catch what they miss</span>
            </div>
            <div style="display:flex;align-items:flex-start;gap:12px;">
              <div style="width:24px;height:24px;border-radius:50%;background:var(--bb100);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:var(--bb600);flex-shrink:0;">3</div>
              <span style="font-size:14px;line-height:1.5;color:var(--text-p);padding-top:3px;">The "lethal trifecta" of prompt injection — private data access, outbound requests, and untrusted content — is present in most agentic systems today</span>
            </div>
            <div style="display:flex;align-items:flex-start;gap:12px;">
              <div style="width:24px;height:24px;border-radius:50%;background:var(--bb100);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:var(--bb600);flex-shrink:0;">4</div>
              <span style="font-size:14px;line-height:1.5;color:var(--text-p);padding-top:3px;">Code is now cheap — the responsibility is to use that abundance to build software that is more accessible and humane, not merely more</span>
            </div>
          </div>
        </div>

        <!-- Full Summary -->
        <div style="background:var(--white);border:1px solid var(--border-light);border-radius:12px;padding:24px 28px;margin-bottom:24px;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:20px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0063cc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            <span style="font-size:15px;font-weight:700;color:var(--text-p);">Full Summary</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:16px;font-size:14px;line-height:1.7;color:var(--g700);">
            <p>Simon Willison — Django co-creator, Datasette founder, and the person who coined the term "prompt injection" — joined Lenny Rachitsky for a wide-ranging conversation on where AI development actually stands in early 2026. Willison's central claim: November 2025 was the real inflection point, the month when AI coding agents stopped being impressive demos and started being genuinely useful tools for professional software engineers.</p>
            <p>Today, Willison says roughly 95% of the code he produces wasn't typed by him directly — remarkable for someone with 25 years of engineering experience. But he's careful to resist triumphalism: using agents well is cognitively demanding in a new way. He routinely runs four agents in parallel and is exhausted by 11 a.m. The work hasn't gotten easier; it's shifted from writing to reviewing, directing, and catching subtle errors that agents confidently produce.</p>
            <p>He introduced the "dark factory" concept — the idea that some software projects will run almost entirely on agentic pipelines with minimal human oversight. He finds this technically plausible and strategically unsettling. His preferred counter is test-driven development: write a failing test first, then have the agent make it pass. It keeps quality measurable and keeps humans accountable for specifying what "correct" actually means.</p>
            <p>The conversation's sharpest edge was on security. Willison described the "lethal trifecta" of prompt injection risk — an agent with access to private data, the ability to make outbound requests, and exposure to untrusted content. Most agentic systems exhibit all three. He predicts a Challenger-style public failure is coming: not necessarily catastrophic, but embarrassing enough to reset how the industry thinks about trust and oversight. Mid-career engineers, he warned, are most vulnerable — experienced enough to move fast but not experienced enough to know where the floor is.</p>
          </div>
        </div>

        <!-- Audience Engagement section -->
        <div style="background:var(--white);border:1px solid var(--bb100);border-radius:12px;overflow:hidden;margin-bottom:24px;">
          <div style="background:var(--bb25);border-bottom:1px solid var(--bb100);padding:16px 28px;display:flex;align-items:center;gap:10px;">
            <div style="width:30px;height:30px;border-radius:8px;background:var(--bb50);border:1px solid var(--bb200);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 11L3 17V20H12L15 17" stroke="#0063cc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 12l-4.6 4.6a2 2 0 01-2.8 0l-5.2-5.2a2 2 0 010-2.8L14 4" stroke="#0063cc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <span style="font-size:15px;font-weight:700;color:var(--text-p);">Audience Engagement</span>
          </div>
          <div style="padding:20px 28px;display:flex;flex-direction:column;gap:20px;">
            <!-- Metrics -->
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
              <div style="background:var(--g50);border:1px solid var(--border-light);border-radius:10px;padding:14px;">
                <div style="font-size:11px;color:var(--text-s);font-weight:500;margin-bottom:6px;">Attendees who highlighted</div>
                <div style="font-size:28px;font-weight:700;color:var(--text-p);line-height:1;">168</div>
                <div style="font-size:11px;color:var(--text-d);margin-top:4px;">68% of attendees</div>
              </div>
              <div style="background:var(--g50);border:1px solid var(--border-light);border-radius:10px;padding:14px;">
                <div style="font-size:11px;color:var(--text-s);font-weight:500;margin-bottom:6px;">Total highlights</div>
                <div style="font-size:28px;font-weight:700;color:var(--text-p);line-height:1;">2,241</div>
                <div style="font-size:11px;color:var(--text-d);margin-top:4px;">Avg 13.3 per person</div>
              </div>
              <div style="background:var(--g50);border:1px solid var(--border-light);border-radius:10px;padding:14px;">
                <div style="font-size:11px;color:var(--text-s);font-weight:500;margin-bottom:6px;">Engagement</div>
                <div style="font-size:22px;font-weight:700;color:var(--success-text);line-height:1;">High</div>
                <div style="font-size:11px;color:var(--text-d);margin-top:4px;">Top 10% of sessions</div>
              </div>
            </div>
            <!-- Chart -->
            <div>
              <div style="font-size:12px;font-weight:600;color:var(--text-s);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:10px;">Highlights over time</div>
              <canvas id="hl-chart-public" height="100" style="width:100%;display:block;"></canvas>
              <div style="display:flex;justify-content:space-between;margin-top:4px;">
                <span style="font-size:10px;color:var(--text-d);">10:00 AM</span>
                <span style="font-size:10px;color:var(--text-d);">10:26 AM</span>
                <span style="font-size:10px;color:var(--text-d);">10:52 AM</span>
                <span style="font-size:10px;color:var(--text-d);">11:18 AM</span>
              </div>
            </div>
            <!-- Top moments -->
            <div>
              <div style="font-size:12px;font-weight:600;color:var(--text-s);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:12px;">Most-highlighted moments</div>
              <div style="display:flex;flex-direction:column;gap:10px;">
                <div style="display:flex;align-items:flex-start;gap:10px;background:var(--g50);border:1px solid var(--border-light);border-radius:8px;padding:12px 14px;">
                  <div style="width:22px;height:22px;border-radius:6px;background:var(--bb25);color:var(--bb600);border:1px solid var(--bb100);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;margin-top:1px;">1</div>
                  <div style="flex:1;font-size:13px;line-height:1.5;color:var(--text-p);">Today, probably 95% of the code that I produce, I didn&rsquo;t type it myself. And I&rsquo;ve been writing software for 25 years. That number would have seemed completely absurd to me even eighteen months ago.</div>
                  <div style="display:flex;align-items:center;gap:3px;background:var(--bb25);border:1px solid var(--bb100);border-radius:6px;padding:3px 8px;flex-shrink:0;"><span style="font-size:13px;font-weight:600;color:var(--bb600);">156</span><span style="font-size:11px;color:var(--text-d);"> highlights</span></div>
                </div>
                <div style="display:flex;align-items:flex-start;gap:10px;background:var(--g50);border:1px solid var(--border-light);border-radius:8px;padding:12px 14px;">
                  <div style="width:22px;height:22px;border-radius:6px;background:var(--g100);color:var(--text-s);border:1px solid var(--g200);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;margin-top:1px;">2</div>
                  <div style="flex:1;font-size:13px;line-height:1.5;color:var(--text-p);">Using coding agents well is taking every inch of my 25 years of experience as a software engineer. I can fire up four agents in parallel &mdash; by 11 a.m., I am wiped out.</div>
                  <div style="display:flex;align-items:center;gap:3px;background:var(--bb25);border:1px solid var(--bb100);border-radius:6px;padding:3px 8px;flex-shrink:0;"><span style="font-size:13px;font-weight:600;color:var(--bb600);">128</span><span style="font-size:11px;color:var(--text-d);"> highlights</span></div>
                </div>
                <div style="display:flex;align-items:flex-start;gap:10px;background:var(--g50);border:1px solid var(--border-light);border-radius:8px;padding:12px 14px;">
                  <div style="width:22px;height:22px;border-radius:6px;background:var(--g100);color:var(--text-s);border:1px solid var(--g200);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;margin-top:1px;">3</div>
                  <div style="flex:1;font-size:13px;line-height:1.5;color:var(--text-p);">My prediction is that we&rsquo;re going to see a Challenger disaster &mdash; some very public, very embarrassing failure of an agentic system that everyone trusted, caused by prompt injection.</div>
                  <div style="display:flex;align-items:center;gap:3px;background:var(--bb25);border:1px solid var(--bb100);border-radius:6px;padding:3px 8px;flex-shrink:0;"><span style="font-size:13px;font-weight:600;color:var(--bb600);">104</span><span style="font-size:11px;color:var(--text-d);"> highlights</span></div>
                </div>
              </div>
            </div>
            <!-- Reactions breakdown -->
            <div>
              <div style="font-size:12px;font-weight:600;color:var(--text-s);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:10px;">Audience reactions <span style="font-size:11px;font-weight:400;color:var(--text-d);text-transform:none;letter-spacing:0;">847 total</span></div>
              <div class="react-breakdown-row">
                <div class="react-stat"><span class="react-stat-emoji">👍</span><span class="react-stat-count">312</span><span class="react-stat-pct">37%</span></div>
                <div class="react-stat"><span class="react-stat-emoji">❤️</span><span class="react-stat-count">248</span><span class="react-stat-pct">29%</span></div>
                <div class="react-stat"><span class="react-stat-emoji">❓</span><span class="react-stat-count">167</span><span class="react-stat-pct">20%</span></div>
                <div class="react-stat"><span class="react-stat-emoji">👎</span><span class="react-stat-count">120</span><span class="react-stat-pct">14%</span></div>
              </div>
            </div>
            <!-- AI summary -->
            <div style="background:var(--bb25);border:1px solid var(--bb100);border-radius:8px;padding:16px 18px;">
              <p style="font-size:13px;line-height:1.65;color:var(--g700);">Attendees engaged most heavily with Simon&rsquo;s personal experience claims &mdash; the 95% stat and the &ldquo;wiped out by 11 a.m.&rdquo; framing resonated far more than the abstract predictions. The Challenger disaster quote drove a secondary spike, suggesting this audience is thinking seriously about AI risk, not just capability. Highlights were densely clustered in the first 30 minutes and the final 10, with a relative lull during the TDD and benchmarking sections.</p>
            </div>
          </div>
        </div>

      </div>

      <!-- Footer -->
      <div style="border-top:1px solid var(--border-light);padding:16px 24px;text-align:center;font-size:12px;color:var(--text-s);display:flex;align-items:center;justify-content:center;gap:16px;flex-wrap:wrap;">
        <a href="#" style="color:var(--bb500);text-decoration:none;font-weight:500;">Wordly AI Interpretation</a>
        <span style="color:var(--border);">|</span>
        <a href="#" style="color:var(--text-s);text-decoration:none;">Privacy Policy</a>
        <span style="color:var(--border);">|</span>
        <a href="#" style="color:var(--text-s);text-decoration:none;">Terms of Service</a>
        <span style="color:var(--border);">|</span>
        <span>Copyright &copy; 2019-2026 Wordly, Inc.</span>
        <span style="color:var(--border);">|</span>
        <span>Version 3.0.2</span>
      </div>
    </div>

    <!-- SESSION ENDED VIEW — overlays the main area -->
    <div id="view-ended" style="display:none;position:absolute;inset:0;z-index:50;">
      <div class="ended-overlay">
        <div class="ended-modal">
          <div class="ended-modal-header">
            <div>
              <div class="ended-modal-title">Session complete</div>
              <div class="ended-modal-subtitle">An AI State of the Union &mdash; Lenny&rsquo;s Newsletter with Simon Willison</div>
            </div>
            <button class="ended-close-btn" onclick="showView('attendee')" aria-label="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="ended-modal-body">
            <div>
              <div class="ended-section-title">Session Summary</div>
              <div class="ended-summary-box" id="ended-session-summary">
                <div class="shimmer-gray" style="width:100%;margin-bottom:6px;"></div>
                <div class="shimmer-gray" style="width:87%;margin-bottom:6px;"></div>
                <div class="shimmer-gray" style="width:70%;margin-bottom:0;"></div>
              </div>
            </div>
            <div>
              <div class="ended-section-title">Your Highlights Summary</div>
              <div class="ended-hl-summary-box" id="ended-hl-summary">
                <div class="ai-shimmer" style="width:100%;"></div>
                <div class="ai-shimmer s2"></div>
                <div class="ai-shimmer s3"></div>
              </div>
            </div>
            <div class="ended-divider"></div>
            <div>
              <div class="ended-hl-section-header">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 11L3 17V20H12L15 17" stroke="#0063cc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 12l-4.6 4.6a2 2 0 01-2.8 0l-5.2-5.2a2 2 0 010-2.8L14 4" stroke="#0063cc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                <div class="ended-hl-section-title">My Highlights</div>
              </div>
              <div class="ended-hl-items" id="ended-hl-items">
                <div class="ended-no-highlights" id="ended-no-hl">No highlights saved yet.</div>
              </div>
            </div>
          </div>
          <div class="ended-modal-footer">
            <button class="ended-btn-primary" id="ended-copy-btn" onclick="copyEndedHighlights(this)">Copy My Highlights</button>
            <div id="ended-email-wrap" style="display:none;">
              <input class="ended-email-input" id="ended-email-input" type="email" placeholder="your@email.com" style="margin-bottom:8px;">
              <button class="ended-btn-primary" onclick="sendEndedHighlights(this)">Send</button>
            </div>
            <button class="ended-btn-secondary" onclick="toggleSendEmail('ended-email-wrap','ended-send-btn')" id="ended-send-btn">Send Highlights</button>
            <button class="ended-btn-secondary" onclick="showView('public')" style="display:flex;align-items:center;justify-content:center;gap:7px;color:var(--bb600);border-color:var(--bb200);background:var(--bb25);">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              View public summary
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>

</div>

<script>
// ─── LANGUAGE MAP ─────────────────────────────────────────────────────────
const LANG_NAMES={
  'en':'English (US)','en-GB':'English (UK)','en-AU':'English (AU)',
  'ar':'Arabic','zh-CN':'Chinese (Simplified)','zh-TW':'Chinese (Traditional)',
  'zh-HK':'Cantonese','nl':'Dutch','fr':'French','fr-CA':'French (Canada)',
  'de':'German','hi':'Hindi','id':'Indonesian','it':'Italian','ja':'Japanese',
  'ko':'Korean','ms':'Malay','pl':'Polish','pt-BR':'Portuguese (Brazil)',
  'pt':'Portuguese','ru':'Russian','es':'Spanish','es-MX':'Spanish (LatAm)',
  'sw':'Swahili','tl':'Tagalog','ta':'Tamil','th':'Thai','tr':'Turkish',
  'uk':'Ukrainian','ur':'Urdu','vi':'Vietnamese','af':'Afrikaans',
  'sq':'Albanian','hy':'Armenian','bn':'Bengali','bs':'Bosnian','bg':'Bulgarian',
  'ca':'Catalan','hr':'Croatian','cs':'Czech','da':'Danish','et':'Estonian',
  'fi':'Finnish','ka':'Georgian','el':'Greek','gu':'Gujarati','ht':'Haitian Creole',
  'he':'Hebrew','hu':'Hungarian','is':'Icelandic','ga':'Irish','kn':'Kannada',
  'lv':'Latvian','lo':'Lao','lt':'Lithuanian','mk':'Macedonian','mt':'Maltese',
  'no':'Norwegian','fa':'Persian','pa':'Punjabi','ro':'Romanian','sr':'Serbian',
  'sk':'Slovak','sl':'Slovenian','sv':'Swedish','cy':'Welsh','zu':'Zulu'
};

// ─── DEMO SCRIPT ──────────────────────────────────────────────────────────
const SCRIPT=[
  {speaker:'Lenny Rachitsky',time:'10:02',text:'Simon, you co-created Django, you built Datasette, you coined the term "prompt injection" — you\'ve been at the center of this AI wave longer than almost anyone. Where are we right now?'},
  {speaker:'Simon Willison',time:'10:03',text:'November 2025 was the inflection point. That\'s when AI coding agents crossed from "mostly works" to "actually works." I don\'t think people have fully reckoned with how fast everything changed in that one month.'},
  {speaker:'Simon Willison',time:'10:04',text:'Today, probably 95% of the code that I produce, I didn\'t type it myself. And I\'ve been writing software for 25 years. That number would have seemed completely absurd to me even eighteen months ago.'},
  {speaker:'Lenny Rachitsky',time:'10:06',text:'So what does a day actually look like for you now? What\'s changed in how you work?'},
  {speaker:'Simon Willison',time:'10:07',text:'I fire up four agents in parallel. Each one is working on a different problem. I\'m reviewing output, asking clarifying questions, redirecting. By 11 a.m., I am completely wiped out. It\'s cognitively exhausting in a way that solo coding never was.'},
  {speaker:'Simon Willison',time:'10:08',text:'Using coding agents well is taking every inch of my 25 years of experience as a software engineer. You need to know what good looks like. You need to catch the subtle bugs. The agents don\'t know what they don\'t know.'},
  {speaker:'Lenny Rachitsky',time:'10:10',text:'You\'ve talked about the "dark factory" pattern — what do you mean by that?'},
  {speaker:'Simon Willison',time:'10:11',text:'A dark factory is a manufacturing plant that runs without lights — because there\'s nobody there. I think we\'re going to see a lot of software projects that are essentially dark factories. Agents building, agents reviewing, agents shipping.'},
  {speaker:'Lenny Rachitsky',time:'10:13',text:'What\'s your approach for keeping the quality bar high when you\'re working this fast?'},
  {speaker:'Simon Willison',time:'10:14',text:'Red-green TDD. Write a failing test first. Then have the agent make it pass. It sounds old-fashioned but it\'s the best forcing function I\'ve found. It gives the model a concrete target and gives you a clear signal when it\'s actually done.'},
  {speaker:'Simon Willison',time:'10:15',text:'I also built the pelican benchmark — a deliberately absurd test to see if models will just hallucinate plausible-sounding answers. Most of them fail it immediately. Knowing that helps me calibrate how much to trust any given output.'},
  {speaker:'Lenny Rachitsky',time:'10:17',text:'You\'ve written a lot about prompt injection. Why does it worry you so much?'},
  {speaker:'Simon Willison',time:'10:18',text:'There\'s a lethal trifecta: an agent with access to private data, the ability to make outbound requests, and exposure to untrusted content. When all three are present, prompt injection becomes a serious attack vector. And most agentic systems have all three.'},
  {speaker:'Simon Willison',time:'10:19',text:'My prediction is that we\'re going to see a Challenger disaster. Not necessarily catastrophic loss of life — but some very public, very embarrassing failure of an agentic system that everyone trusted, caused by prompt injection.'},
  {speaker:'Lenny Rachitsky',time:'10:21',text:'Who\'s most at risk from all of this — from the pace of change?'},
  {speaker:'Simon Willison',time:'10:22',text:'Mid-career engineers. Not senior — they have enough experience to know what they don\'t know. Not juniors — they\'re used to learning fast. The dangerous zone is someone who\'s been doing this 5 to 10 years and thinks they\'ve got it figured out. They\'re the ones the agents are going to fool.'},
  {speaker:'Simon Willison',time:'10:24',text:'Code is now cheap. I want that to be a good thing. I want us to build software that is better than we were building before — more accessible, more thoughtful, more humane. But cheap code can also mean careless code. The responsibility doesn\'t go away just because the agent wrote it.'},
];

// ─── STATE ────────────────────────────────────────────────────────────────
let ws=null,wsPresenter=null,isLive=false,sessionCode='',attendeeLanguage='en',attendeeName='';
const highlighted=new Set();
let bubbleCounter=0,currentSpeaker=null,currentGroup=null;
const phraseMap={},speakerNames={};
let scriptIndex=0,demoTimer=null,reconnectAttempts=0,reconnectTimer=null;
// Shared transcript log — populated by both demo and live WS; drives presenter view
const transcriptItems=[];
let presLastSpeaker=null,presLiveBubbleEl=null;

// ─── HELPERS ──────────────────────────────────────────────────────────────
function formatTime(ms){if(!ms)return '';const d=new Date(ms);return d.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'});}
function setConnStatus(state,label){const pill=document.getElementById('conn-status-pill');const txt=document.getElementById('conn-status-text');pill.className='conn-status '+state;txt.textContent=label;}
function escapeHtml(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

// ─── JOIN OVERLAY ─────────────────────────────────────────────────────────
document.getElementById('join-code').addEventListener('input',function(){
  let v=this.value.replace(/[^A-Za-z0-9]/g,'').toUpperCase();
  if(v.length>4)v=v.slice(0,4)+'-'+v.slice(4,8);
  this.value=v;
  this.classList.remove('error');
  document.getElementById('join-error').classList.remove('visible');
});

function showJoinError(msg){const el=document.getElementById('join-error');el.textContent=msg;el.classList.add('visible');}

function joinSession(){
  const code=document.getElementById('join-code').value.trim().toUpperCase();
  const lang=document.getElementById('join-lang').value;
  const name=document.getElementById('join-name').value.trim();
  if(!/^[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code)){
    document.getElementById('join-code').classList.add('error');
    showJoinError('Please enter a valid session code in the format XXXX-0000.');
    return;
  }
  sessionCode=code;attendeeLanguage=lang;attendeeName=name;
  document.getElementById('join-btn').disabled=true;
  document.getElementById('join-btn').textContent='Connecting…';
  connectWebSocket(code,lang,name);
}

function startDemo(){
  document.getElementById('join-overlay').classList.add('hidden');
  sessionCode='DEMO';
  document.getElementById('session-id-display').textContent='Demo mode';
  setConnStatus('demo','Demo');
  isLive=false;
  beginDemo();
}

// ─── WEBSOCKET ────────────────────────────────────────────────────────────
const WS_URL='wss://endpoint.wordly.ai/attend';
const CONNECTION_CODE='9010';

function connectWebSocket(code,lang,name){
  if(ws){try{ws.close();}catch(e){}}
  setConnStatus('connecting','Connecting…');
  ws=new WebSocket(WS_URL);
  ws.binaryType='arraybuffer';
  ws.onopen=()=>{
    reconnectAttempts=0;
    const req={type:'connect',presentationCode:code,languageCode:lang,connectionCode:CONNECTION_CODE};
    if(name)req.name=name;
    ws.send(JSON.stringify(req));
  };
  ws.onmessage=(evt)=>{
    let msg;try{msg=JSON.parse(evt.data);}catch(e){return;}
    handleAttendMessage(msg);
  };
  ws.onerror=()=>{};
  ws.onclose=()=>{
    if(!isLive){
      document.getElementById('join-btn').disabled=false;
      document.getElementById('join-btn').innerHTML=`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg> Join session`;
      showJoinError('Could not connect. Check the session code and try again.');
      return;
    }
    if(reconnectAttempts<5){
      reconnectAttempts++;
      setConnStatus('connecting',`Reconnecting (${reconnectAttempts})…`);
      reconnectTimer=setTimeout(()=>connectWebSocket(sessionCode,attendeeLanguage,attendeeName),2000*reconnectAttempts);
    }else{
      setConnStatus('error','Disconnected');
    }
  };
}

function handleAttendMessage(msg){
  switch(msg.type){
    case 'status':
      if(msg.success){
        isLive=true;
        document.getElementById('join-overlay').classList.add('hidden');
        document.getElementById('session-id-display').textContent=sessionCode;
        updateLangDisplay(attendeeLanguage);
        setConnStatus('live','Live');
      }else{
        document.getElementById('join-btn').disabled=false;
        document.getElementById('join-btn').innerHTML=`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg> Join session`;
        const errMap={1:'Invalid session code or language.',2:'That session is not available right now.',3:'Not enough minutes available to join this session.',4:'This session has ended.',6:'Authorization error. Please check your session code.'};
        showJoinError(errMap[msg.code]||(msg.message||'Could not join. Please try again.'));
      }
      break;
    case 'phrase':
      if(!msg.isFinal)handleNonFinalPhrase(msg);
      else handleFinalPhrase(msg);
      break;
    case 'end':
      setConnStatus('demo','Ended');
      if(ws){try{ws.close();}catch(e){}ws=null;}
      isLive=false;
      showView('ended');
      break;
    case 'error':
      console.warn('Wordly /attend error:',msg.message);
      break;
  }
}

function handleNonFinalPhrase(msg){
  if(phraseMap[msg.phraseId]!==undefined){
    const id=phraseMap[msg.phraseId];
    const textEl=document.querySelector(`#bubble-${id} .bubble-text`);
    if(textEl)textEl.textContent=msg.translatedText||msg.originalText;
    return;
  }
  const displayName=msg.name||('Speaker '+msg.speakerId.slice(0,4));
  speakerNames[msg.speakerId]=displayName;
  const id=addLiveBubble(msg.speakerId,displayName,msg.translatedText||msg.originalText,true);
  phraseMap[msg.phraseId]=id;
}

function handleFinalPhrase(msg){
  const displayName=msg.name||speakerNames[msg.speakerId]||('Speaker '+msg.speakerId.slice(0,4));
  speakerNames[msg.speakerId]=displayName;
  const text=msg.translatedText||msg.originalText;
  if(phraseMap[msg.phraseId]!==undefined){
    const id=phraseMap[msg.phraseId];
    const bubble=document.getElementById('bubble-'+id);
    const textEl=bubble&&bubble.querySelector('.bubble-text');
    if(textEl){
      textEl.textContent=text;
      bubble.classList.remove('pending');
      const timeStr=formatTime(Date.now());
      bubble.onclick=()=>bubbleClick(id,timeStr,text);
      // Finalize in shared log and presenter
      transcriptItems.push({id,speaker:displayName,text,time:timeStr});
      presFinalizeLiveBubble(text);
      presAppendItem(id,displayName,text);
    }
    delete phraseMap[msg.phraseId];
  }else{
    addLiveBubble(msg.speakerId,displayName,text,false);
  }
}

// ─── BUBBLE RENDERING ─────────────────────────────────────────────────────
function addLiveBubble(speakerId,speakerName,text,isPending){
  const id=++bubbleCounter;
  const body=document.getElementById('transcript-body');
  const timeStr=formatTime(Date.now());
  if(speakerId!==currentSpeaker){
    currentSpeaker=speakerId;
    currentGroup=document.createElement('div');
    currentGroup.className='speaker-group';
    const lbl=document.createElement('div');
    lbl.className='speaker-label';
    lbl.textContent=speakerName;
    currentGroup.appendChild(lbl);
    body.appendChild(currentGroup);
  }
  const row=document.createElement('div');
  row.className='bubble-row new';
  const pendingClass=isPending?' pending':'';
  row.innerHTML=`<div class="bubble${pendingClass}" id="bubble-${id}"><span class="bubble-text">${escapeHtml(text)}</span></div>`;
  if(!isPending)row.querySelector('.bubble').onclick=()=>bubbleClick(id,timeStr,text);
  currentGroup.appendChild(row);
  setTimeout(()=>row.classList.remove('new'),200);
  const sc=document.getElementById('transcript-scroll');
  sc.scrollTop=sc.scrollHeight;
  // Feed presenter
  if(isPending){
    presUpdateLiveBubble(speakerName,text);
  }else{
    presFinalizeLiveBubble();
    transcriptItems.push({id,speaker:speakerName,text,time:timeStr});
    presAppendItem(id,speakerName,text);
  }
  return id;
}

function addBubble(entry){
  const id=++bubbleCounter;
  const body=document.getElementById('transcript-body');
  if(entry.speaker!==currentSpeaker){
    currentSpeaker=entry.speaker;
    currentGroup=document.createElement('div');
    currentGroup.className='speaker-group';
    const lbl=document.createElement('div');
    lbl.className='speaker-label';
    lbl.textContent=entry.speaker;
    currentGroup.appendChild(lbl);
    body.appendChild(currentGroup);
  }
  const row=document.createElement('div');
  row.className='bubble-row new';
  row.innerHTML=`<div class="bubble" id="bubble-${id}"><span class="bubble-text">${escapeHtml(entry.text)}</span></div>`;
  row.querySelector('.bubble').onclick=()=>bubbleClick(id,entry.time,entry.text);
  currentGroup.appendChild(row);
  setTimeout(()=>row.classList.remove('new'),200);
  const sc=document.getElementById('transcript-scroll');
  sc.scrollTop=sc.scrollHeight;
  // Feed shared transcript log and presenter view
  transcriptItems.push({id,speaker:entry.speaker,text:entry.text,time:entry.time});
  presAppendItem(id,entry.speaker,entry.text);
}

function beginDemo(){
  function deliverNext(){
    if(scriptIndex>=SCRIPT.length)return;
    addBubble(SCRIPT[scriptIndex++]);
    demoTimer=setTimeout(deliverNext,1650+Math.random()*900);
  }
  demoTimer=setTimeout(deliverNext,400);
}

// ─── HIGHLIGHT LOGIC ──────────────────────────────────────────────────────
function toggleHL(id,time,text){
  const bubble=document.getElementById('bubble-'+id);
  if(!bubble||bubble.classList.contains('pending'))return;
  if(highlighted.has(id)){
    highlighted.delete(id);
    delete reactions[id];
    ['d','m'].forEach(k=>{const el=document.getElementById('hlitem-'+id+'-'+k);if(el)el.remove();});
    renderReactionBadges(id);
  }else{
    highlighted.add(id);
    addHLItem(id,time,text,'d','hlp-scroll-desktop',true);
    addHLItem(id,time,text,'m','bs-scroll',false);
  }
  const n=highlighted.size;
  document.getElementById('hl-count-desktop').textContent=n;
  document.getElementById('hlp-empty-desktop').style.display=n===0?'flex':'none';
  document.getElementById('hlp-footer-desktop').style.display=n>0?'flex':'none';
  const badge=document.getElementById('fab-badge');
  badge.textContent=n;
  badge.classList.toggle('visible',n>0);
  document.getElementById('bs-empty').style.display=n===0?'flex':'none';
  updatePresEngagement(id);
}

function addHLItem(id,time,text,suffix,scrollId,isDesktop){
  const scroll=document.getElementById(scrollId);
  if(!scroll)return;
  const item=document.createElement('div');
  item.className=isDesktop?'hlp-item':'bs-item';
  item.id='hlitem-'+id+'-'+suffix;
  item.style.animation='hlIn .18s ease-out';
  item.innerHTML=`<div class="${isDesktop?'hlp-item-time':'bs-item-time'}">${time}</div><div class="${isDesktop?'hlp-item-text':'bs-item-text'}">${escapeHtml(text)}</div>`;
  item.onclick=()=>{
    const b=document.getElementById('bubble-'+id);
    if(b){b.scrollIntoView({behavior:'smooth',block:'center'});b.style.boxShadow='0 0 0 3px rgba(0,99,204,0.2)';setTimeout(()=>{b.style.boxShadow='';},1200);}
    if(!isDesktop)closeSheet();
  };
  scroll.appendChild(item);
  scroll.scrollTop=scroll.scrollHeight;
}

// ─── LANGUAGE / DISCONNECT ────────────────────────────────────────────────
function updateLangDisplay(code){
  const name=LANG_NAMES[code]||code.toUpperCase();
  const btn=document.querySelector('.lang-selector');
  if(btn){btn.innerHTML=`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>${name.toUpperCase()}<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>`;}
}

// ─── LANGUAGE PICKER POPOVER ──────────────────────────────────────────────
const LANG_GROUPS=[
  {label:'English',codes:['en','en-GB','en-AU']},
  {label:'Common languages',codes:['ar','zh-CN','zh-TW','zh-HK','nl','fr','fr-CA','de','hi','id','it','ja','ko','ms','pl','pt-BR','pt','ru','es','es-MX','sw','tl','ta','th','tr','uk','ur','vi']},
  {label:'Other languages',codes:['af','sq','hy','bn','bs','bg','ca','hr','cs','da','et','fi','ka','el','gu','ht','he','hu','is','ga','kn','lv','lo','lt','mk','mt','no','fa','pa','ro','sr','sk','sl','sv','cy','zu']}
];

function buildLangPicker(){
  const pop=document.getElementById('lang-popover');
  const checkSvg=`<svg class="lang-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
  let html='';
  LANG_GROUPS.forEach(g=>{
    html+=`<div class="lang-group-label">${g.label}</div>`;
    g.codes.forEach(code=>{
      const name=LANG_NAMES[code]||code;
      html+=`<button class="lang-option" data-code="${code}" onclick="selectLanguage('${code}')"><span>${name}</span>${checkSvg}</button>`;
    });
  });
  pop.innerHTML=html;
  markSelectedLang();
}

function markSelectedLang(){
  document.querySelectorAll('#lang-popover .lang-option').forEach(b=>{
    b.classList.toggle('selected',b.dataset.code===attendeeLanguage);
  });
}

function toggleLangPicker(ev){
  if(ev)ev.stopPropagation();
  const pop=document.getElementById('lang-popover');
  const btn=document.getElementById('lang-selector-btn');
  const willOpen=pop.classList.contains('hidden');
  if(willOpen){
    if(!pop.dataset.built){buildLangPicker();pop.dataset.built='1';}
    markSelectedLang();
    pop.classList.remove('hidden');
    btn.setAttribute('aria-expanded','true');
    // Scroll the selected option into view
    const sel=pop.querySelector('.lang-option.selected');
    if(sel)sel.scrollIntoView({block:'center'});
  }else{
    closeLangPicker();
  }
}

function closeLangPicker(){
  const pop=document.getElementById('lang-popover');
  pop.classList.add('hidden');
  document.getElementById('lang-selector-btn')?.setAttribute('aria-expanded','false');
}

function selectLanguage(code){
  if(code===attendeeLanguage){closeLangPicker();return;}
  attendeeLanguage=code;
  updateLangDisplay(code);
  markSelectedLang();
  // Send change request to /attend per Endpoint Services spec
  if(ws&&ws.readyState===WebSocket.OPEN&&isLive){
    ws.send(JSON.stringify({type:'change',languageCode:code}));
  }
  closeLangPicker();
}

// Dismiss popover on outside click
document.addEventListener('click',function(e){
  const pop=document.getElementById('lang-popover');
  if(!pop||pop.classList.contains('hidden'))return;
  if(pop.contains(e.target))return;
  if(e.target.closest('#lang-selector-btn'))return;
  closeLangPicker();
});

function disconnectSession(){
  if(ws&&ws.readyState===WebSocket.OPEN){ws.send(JSON.stringify({type:'disconnect'}));ws.close();ws=null;}
  isLive=false;
  setConnStatus('demo','Disconnected');
}

function exitSession(){
  // Stop demo timer if running
  if(demoTimer){clearTimeout(demoTimer);demoTimer=null;}
  // Cancel any pending reconnect
  if(reconnectTimer){clearTimeout(reconnectTimer);reconnectTimer=null;}
  // Cleanly disconnect WS if live
  disconnectSession();
  closeLangPicker();
  showView('ended');
}

document.getElementById('conn-status-pill').addEventListener('click',function(){
  if(isLive){if(confirm('Leave this session?'))disconnectSession();}
});

// ─── MOBILE SHEET ─────────────────────────────────────────────────────────
function openSheet(){
  const o=document.getElementById('bs-overlay'),s=document.getElementById('bottom-sheet');
  o.style.display='block';
  requestAnimationFrame(()=>{o.classList.add('open');s.classList.add('open');});
}
function closeSheet(){
  const o=document.getElementById('bs-overlay'),s=document.getElementById('bottom-sheet');
  o.classList.remove('open');s.classList.remove('open');
  setTimeout(()=>{o.style.display='none';},280);
}

// ─── VIEW TOGGLE ──────────────────────────────────────────────────────────
function showView(v){
  closeBubblePopover();
  document.getElementById('view-attendee').style.display=v==='attendee'?'flex':'none';
  document.getElementById('view-presenter').style.display=v==='presenter'?'flex':'none';
  document.getElementById('view-ended').style.display=v==='ended'?'block':'none';
  document.getElementById('view-public').style.display=v==='public'?'block':'none';
  document.getElementById('btn-attendee').classList.toggle('active',v==='attendee');
  document.getElementById('btn-presenter').classList.toggle('active',v==='presenter');
  document.getElementById('btn-ended').classList.toggle('active',v==='ended');
  document.getElementById('btn-organizer').classList.toggle('active',v==='organizer');
  document.getElementById('btn-public').classList.toggle('active',v==='public');
  document.getElementById('attend-subnav').style.display=(v==='attendee'||v==='ended')?'flex':'none';
  const org=document.getElementById('view-organizer');
  if(v==='organizer'){
    org.style.display='flex';
    requestAnimationFrame(()=>{const main=document.getElementById('main-area');org.style.height=main.getBoundingClientRect().height+'px';});
  }else{
    org.style.display='none';org.style.height='';
  }
  if(v==='ended')buildEndedModal();
  if(v==='organizer')requestAnimationFrame(drawHlChart);
  if(v==='public')requestAnimationFrame(()=>drawChartOn('hl-chart-public'));
  if(v==='presenter')initPresenterView();
}

// ─── ORGANIZER ────────────────────────────────────────────────────────────
function setAiState(s){
  document.getElementById('ai-loading').style.display=s==='loading'?'block':'none';
  document.getElementById('ai-ready').style.display=s==='ready'?'block':'none';
  document.getElementById('ai-error').style.display=s==='error'?'block':'none';
}

// ─── EMAIL / COPY ─────────────────────────────────────────────────────────
let emailOpen=false;
function toggleEmail(){
  emailOpen=!emailOpen;
  document.getElementById('email-section-desktop').style.display=emailOpen?'block':'none';
}

function copyHighlights(btn){
  const lines=[];
  highlighted.forEach(id=>{
    const timeEl=document.querySelector(`#hlitem-${id}-d .hlp-item-time`);
    const textEl=document.querySelector(`#hlitem-${id}-d .hlp-item-text`);
    if(timeEl&&textEl)lines.push(`[${timeEl.textContent}] ${textEl.textContent}`);
  });
  const txt=lines.length?lines.join('\n\n'):'';
  if(navigator.clipboard&&txt)navigator.clipboard.writeText(txt).catch(()=>{});
  const orig=btn.innerHTML;
  btn.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg> Copied!`;
  btn.style.background='#0a7b3f';
  setTimeout(()=>{btn.innerHTML=orig;btn.style.background='';},2000);
}

// ─── CHARTS ───────────────────────────────────────────────────────────────
function drawHlChart(){drawChartOn('hl-chart');}
function drawChartOn(canvasId){
  const canvas=document.getElementById(canvasId);
  if(!canvas)return;
  const dpr=window.devicePixelRatio||1;
  const W=canvas.parentElement.clientWidth;
  const H=parseInt(canvas.getAttribute('height'))||90;
  canvas.width=W*dpr;canvas.height=H*dpr;canvas.style.width=W+'px';canvas.style.height=H+'px';
  const ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);
  const data=[4,9,18,31,52,74,89,94,87,72,58,48,63,81,76,54,38,21];
  const max=Math.max(...data);
  const pad={top:8,right:4,bottom:4,left:28};
  const iW=W-pad.left-pad.right,iH=H-pad.top-pad.bottom,step=iW/(data.length-1);
  ctx.lineWidth=1;ctx.font='9px Roboto,sans-serif';ctx.textAlign='right';
  [0,0.5,1].forEach(t=>{
    const y=pad.top+iH*(1-t);
    ctx.strokeStyle='#e3e6e8';ctx.beginPath();ctx.moveTo(pad.left,y);ctx.lineTo(pad.left+iW,y);ctx.stroke();
    ctx.fillStyle='#9ba3ab';ctx.fillText(Math.round(max*t),pad.left-4,y+3);
  });
  const grad=ctx.createLinearGradient(0,pad.top,0,pad.top+iH);
  grad.addColorStop(0,'rgba(0,99,204,0.15)');grad.addColorStop(1,'rgba(0,99,204,0.01)');
  ctx.beginPath();
  data.forEach((v,i)=>{const x=pad.left+i*step,y=pad.top+iH*(1-v/max);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});
  ctx.lineTo(pad.left+(data.length-1)*step,pad.top+iH);ctx.lineTo(pad.left,pad.top+iH);
  ctx.closePath();ctx.fillStyle=grad;ctx.fill();
  ctx.beginPath();ctx.strokeStyle='#0063cc';ctx.lineWidth=2;ctx.lineJoin='round';ctx.lineCap='round';
  data.forEach((v,i)=>{const x=pad.left+i*step,y=pad.top+iH*(1-v/max);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});
  ctx.stroke();
}

window.addEventListener('resize',()=>{
  const org=document.getElementById('view-organizer');
  if(org.style.display!=='none'){
    const main=document.getElementById('main-area');
    org.style.height=main.getBoundingClientRect().height+'px';
    drawHlChart();
  }
  const pub=document.getElementById('view-public');
  if(pub&&pub.style.display!=='none')drawChartOn('hl-chart-public');
});

// ─── SESSION ENDED ────────────────────────────────────────────────────────
function getTranscriptData(){
  const groups=document.querySelectorAll('#transcript-body .speaker-group');
  const speakers=[],bubbles=[];
  groups.forEach(group=>{
    const speaker=group.querySelector('.speaker-label')?.textContent.trim()||'';
    if(speaker&&!speakers.includes(speaker))speakers.push(speaker);
    group.querySelectorAll('.bubble-text').forEach(b=>{
      if(!b.closest('.bubble')?.classList.contains('pending')){
        const t=b.textContent.trim();
        if(t)bubbles.push({speaker,text:t});
      }
    });
  });
  return{speakers,bubbles};
}

function fmtList(arr){
  if(!arr.length)return'';
  if(arr.length===1)return arr[0];
  if(arr.length===2)return arr[0]+' and '+arr[1];
  return arr.slice(0,-1).join(', ')+', and '+arr[arr.length-1];
}

function extractStats(bubbles){
  const re=/\b\d+\s*(%|percent|languages?|milliseconds?|\bms\b|countries|enterprises|people|attendees?)\b/gi;
  const found=new Set();
  bubbles.forEach(b=>{let m;const r=new RegExp(re.source,'gi');while((m=r.exec(b.text))!==null)found.add(m[0]);});
  return[...found];
}

function detectTheme(texts){
  const j=texts.join(' ').toLowerCase();
  if(/\b(95%|didn.t type|wiped out|25 years|inflection|november 2025)\b/.test(j))return'experience';
  if(/\b(prompt injection|challenger|lethal trifecta|agentic|dark factory)\b/.test(j))return'risk';
  if(/\b(tdd|test|pelican|benchmark|red.green|failing test)\b/.test(j))return'craft';
  if(/\b(ai|model|coding|agent|code is cheap|iteration)\b/.test(j))return'ai';
  return'general';
}

function buildSessionSummary(speakers,bubbles){
  if(!bubbles.length)return'No transcript available for this session.';
  const sp=fmtList(speakers)||'the presenter';
  const allText=bubbles.map(b=>b.text).join(' ');
  const outroText=bubbles.slice(-4).map(b=>b.text).join(' ');

  const sentences=[];

  // Sentence 1: who + framing
  let s1=`This session featured ${sp}`;
  if(/lenny|newsletter|podcast/i.test(allText))s1+=` in a conversation for Lenny's Newsletter`;
  const topics=[];
  if(/inflection|november 2025|coding agent/i.test(allText))topics.push('the AI coding inflection point');
  if(/prompt injection|challenger|lethal trifecta/i.test(allText))topics.push('AI security risks');
  if(/dark factory|agentic/i.test(allText))topics.push('autonomous agentic development');
  if(topics.length)s1+=`, exploring ${fmtList(topics.slice(0,2))}`;
  sentences.push(s1+'.');

  // Sentence 2: central thesis
  if(/95%|didn.t type|25 years/i.test(allText)){
    sentences.push(`The central claim: even a 25-year veteran now produces roughly 95% of their code via AI agents — yet using those agents well requires every bit of that experience to catch what the model misses.`);
  }

  // Sentence 3: closing idea
  if(/challenger|prompt injection|lethal trifecta/i.test(outroText)){
    sentences.push(`The conversation closed on risk: with prompt injection affecting most agentic systems, a major public failure may be what finally forces the industry to reckon with oversight and trust.`);
  }else if(/cheap|better.*software|humane|accessible/i.test(allText)){
    sentences.push(`A closing theme: code is now cheap, and that abundance should be directed toward building software that is more thoughtful and humane — not merely more.`);
  }else{
    sentences.push(`The discussion challenged assumptions about where AI development is headed and who is best positioned to navigate the transition.`);
  }

  return sentences.join(' ');
}

function buildHighlightsSummary(n){
  if(n===0)return'You didn\'t save any highlights this session. Next time, tap any speech bubble and pick a reaction to bookmark key moments — they\'ll be ready for you here when the session ends.';

  const hlTexts=[],speakerCounts={};
  highlighted.forEach(id=>{
    const el=document.getElementById('hlitem-'+id+'-d');
    if(el){const t=el.querySelector('[class$="-text"]');if(t)hlTexts.push(t.textContent.trim());}
    const lbl=document.querySelector('#bubble-'+id)?.closest('.speaker-group')?.querySelector('.speaker-label');
    if(lbl){const name=lbl.textContent.trim();speakerCounts[name]=(speakerCounts[name]||0)+1;}
  });

  const speakerNames=Object.keys(speakerCounts).sort((a,b)=>speakerCounts[b]-speakerCounts[a]);
  const topSpeaker=speakerNames[0]||'';
  const theme=detectTheme(hlTexts);

  const insights={
    experience:`Your highlights focused on the "what it's actually like" moments — the 95% stat, the exhaustion by 11 a.m. You're drawn to concrete experience over abstract claims.`,
    risk:`You gravitated toward the security and risk thread — prompt injection, the Challenger prediction, the lethal trifecta. You're thinking about second-order consequences.`,
    craft:`Your highlights centered on technique — TDD with agents, benchmarking, quality controls. You're thinking practically about how to actually use these tools well.`,
    ai:`You saved the AI-specific structural claims — what agents change about how software gets made. You're tracking the bigger shift.`,
    general:`The moments you saved stood out as most relevant or memorable to you personally.`
  };

  let s=`You saved ${n} highlight${n>1?'s':''} from ${fmtList(speakerNames)||'the session'}. ${insights[theme]}`;

  // Note if one speaker dominated
  if(speakerNames.length>1&&speakerCounts[topSpeaker]>n*0.6){
    s+=` ${topSpeaker.split(' ')[0]}'s contributions resonated with you most.`;
  }

  return s;
}

function generateSummaries(){
  const{speakers,bubbles}=getTranscriptData();
  document.getElementById('ended-session-summary').textContent=buildSessionSummary(speakers,bubbles);
  document.getElementById('ended-hl-summary').textContent=buildHighlightsSummary(highlighted.size);
}

function buildEndedModal(){
  const items=document.getElementById('ended-hl-items');
  const noHl=document.getElementById('ended-no-hl');
  items.innerHTML='';
  const n=highlighted.size;
  if(n===0){
    noHl.style.display='block';items.appendChild(noHl);
  }else{
    noHl.style.display='none';
    highlighted.forEach(id=>{
      const el=document.getElementById('hlitem-'+id+'-d');if(!el)return;
      const t=el.querySelector('[class$="-text"]');
      const div=document.createElement('div');div.className='ended-hl-item';div.textContent=t?t.textContent.trim():'';
      items.appendChild(div);
    });
  }
  generateSummaries();
}

function toggleSendEmail(wrapId,btnId){
  const wrap=document.getElementById(wrapId),btn=document.getElementById(btnId);
  const open=wrap.style.display==='none';
  wrap.style.display=open?'block':'none';
  btn.textContent=open?'Cancel':'Send Highlights';
  if(open){const input=wrap.querySelector('input');if(input)setTimeout(()=>input.focus(),50);}
}

function copyBsHighlights(btn){
  const orig=btn.textContent;btn.textContent='✓ Copied!';btn.style.background='#0a7b3f';
  setTimeout(()=>{btn.textContent=orig;btn.style.background='';},2000);
}

function sendBsHighlights(btn){
  const input=document.getElementById('bs-email-input');
  if(!input.value){input.focus();return;}
  const orig=btn.textContent;btn.textContent='✓ Sent!';btn.style.background='#0a7b3f';
  setTimeout(()=>{btn.textContent=orig;btn.style.background='';input.value='';document.getElementById('bs-email-wrap').style.display='none';document.getElementById('bs-send-btn').textContent='Send Highlights';},2000);
}

function sendEndedHighlights(btn){
  const input=document.getElementById('ended-email-input');
  if(!input.value){input.focus();return;}
  const orig=btn.textContent;btn.textContent='✓ Sent!';btn.style.background='#0a7b3f';
  setTimeout(()=>{btn.textContent=orig;btn.style.background='';input.value='';document.getElementById('ended-email-wrap').style.display='none';document.getElementById('ended-send-btn').textContent='Send Highlights';},2000);
}

function copyEndedHighlights(btn){
  const orig=btn.innerHTML;btn.innerHTML='✓ Copied!';btn.style.background='#0a7b3f';
  setTimeout(()=>{btn.innerHTML=orig;btn.style.background='';},2000);
}

// ─── REACTIONS STATE ──────────────────────────────────────────────────────
const reactions={};
const REACT_EMOJIS=['👍','👎','❤️','❓'];
let audioMuted=false;

// ─── BUBBLE CLICK: react + highlight in one action ───────────────────────
let popCtx=null; // {id,time,text} for the open popover

function bubbleClick(id,time,text){
  const bubble=document.getElementById('bubble-'+id);
  if(!bubble||bubble.classList.contains('pending'))return;
  if(popCtx&&popCtx.id===id){closeBubblePopover();return;}
  openBubblePopover(id,time,text);
}

function openBubblePopover(id,time,text){
  popCtx={id,time,text};
  const pop=document.getElementById('bubble-popover');
  const myR=reactions[id]||new Set();
  pop.innerHTML=REACT_EMOJIS.map(e=>`<button class="bp-react-btn${myR.has(e)?' active':''}" title="React ${e} and save highlight" onclick="popReact('${e}')">${e}</button>`).join('');
  pop.classList.remove('hidden');
  positionBubblePopover();
}

function positionBubblePopover(){
  if(!popCtx)return;
  const pop=document.getElementById('bubble-popover');
  const bubble=document.getElementById('bubble-'+popCtx.id);
  if(!bubble){closeBubblePopover();return;}
  const br=bubble.getBoundingClientRect();
  const sc=document.getElementById('transcript-scroll').getBoundingClientRect();
  if(br.bottom<sc.top+6||br.top>sc.bottom-6){closeBubblePopover();return;}
  const pr=pop.getBoundingClientRect();
  let left=br.left+(br.width-pr.width)/2;
  left=Math.max(8,Math.min(left,window.innerWidth-pr.width-8));
  let top=br.top-pr.height-8;
  if(top<sc.top)top=br.bottom+8;
  pop.style.left=left+'px';
  pop.style.top=top+'px';
}

function closeBubblePopover(){
  popCtx=null;
  document.getElementById('bubble-popover').classList.add('hidden');
}

function popReact(emoji){
  if(!popCtx)return;
  const{id,time,text}=popCtx;
  const cur=reactions[id];
  if(highlighted.has(id)&&cur&&cur.has(emoji)){
    toggleHL(id,time,text); // tapping the active reaction undoes the highlight + reaction
  }else{
    if(!highlighted.has(id))toggleHL(id,time,text); // one action: save highlight…
    reactions[id]=new Set([emoji]); // …and attach the reaction (one per highlight)
    renderReactionBadges(id);
    updatePresEngagement(id);
  }
  closeBubblePopover();
}

// Embed the reaction in a corner of the transcript bubble and the saved highlight
function renderReactionBadges(id){
  const emoji=reactions[id]&&reactions[id].size?[...reactions[id]][0]:null;
  const bubble=document.getElementById('bubble-'+id);
  if(bubble){
    let b=bubble.querySelector('.bubble-react-corner');
    if(emoji){
      if(!b){b=document.createElement('span');b.className='bubble-react-corner';bubble.appendChild(b);}
      b.textContent=emoji;
    }else if(b)b.remove();
  }
  ['d','m'].forEach(sfx=>{
    const item=document.getElementById('hlitem-'+id+'-'+sfx);
    if(!item)return;
    let b=item.querySelector('.hl-corner-react');
    if(emoji){
      if(!b){b=document.createElement('span');b.className='hl-corner-react';item.appendChild(b);}
      b.textContent=emoji;
    }else if(b)b.remove();
  });
}

// Dismiss on outside click / Escape; follow the bubble while the feed scrolls
document.addEventListener('click',function(e){
  if(!popCtx)return;
  const pop=document.getElementById('bubble-popover');
  if(pop.contains(e.target))return;
  if(e.target.closest('.bubble'))return;
  closeBubblePopover();
});
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeBubblePopover();});
document.getElementById('transcript-scroll').addEventListener('scroll',positionBubblePopover);
window.addEventListener('resize',positionBubblePopover);

// ─── HIGHLIGHTS PANEL COLLAPSE ────────────────────────────────────────────
function toggleHLPanel(){
  const col=document.querySelector('.highlights-col');
  const fab=document.getElementById('fab');
  const collapsed=col.classList.toggle('hl-collapsed');
  if(window.innerWidth>600)fab.style.display=collapsed?'flex':'none';
}

function fabClick(){
  if(window.innerWidth>600){
    toggleHLPanel(); // desktop: expand the panel
  }else{
    openSheet(); // mobile: open bottom sheet
  }
}

// ─── PRESENTER VIEW ───────────────────────────────────────────────────────
const WS_PRESENT_URL='wss://endpoint.wordly.ai/present';

function connectPresenterWS(){
  if(wsPresenter&&wsPresenter.readyState===WebSocket.OPEN)return;
  if(!sessionCode||sessionCode==='DEMO')return;
  try{
    wsPresenter=new WebSocket(WS_PRESENT_URL);
    wsPresenter.binaryType='arraybuffer';
    wsPresenter.onopen=()=>{
      wsPresenter.send(JSON.stringify({type:'connect',presentationCode:sessionCode,connectionCode:CONNECTION_CODE}));
      setPresConnStatus('live');
    };
    wsPresenter.onmessage=(evt)=>{
      let msg;try{msg=JSON.parse(evt.data);}catch(e){return;}
      // Presenter WS mirrors phrase messages — transcript already populated via shared attendee WS
      // Handle any presenter-specific message types here
    };
    wsPresenter.onerror=()=>setPresConnStatus('error');
    wsPresenter.onclose=()=>setPresConnStatus('demo');
  }catch(e){setPresConnStatus('error');}
}

function setPresConnStatus(state){
  const dot=document.getElementById('pres-ep-live-dot');
  const label=document.querySelector('.pres-ep-live');
  if(!dot||!label)return;
  if(state==='live'){dot.style.background='var(--success-text)';label.lastChild.textContent='Live';}
  else if(state==='error'){dot.style.background='var(--error-text)';label.lastChild.textContent='Error';}
  else{dot.style.background='var(--text-d)';label.lastChild.textContent='Demo';}
}

function initPresenterView(){
  connectPresenterWS();
  // Render all transcript items accumulated so far
  const body=document.getElementById('pres-body');
  body.innerHTML='';
  presLastSpeaker=null;
  presLiveBubbleEl=null;
  transcriptItems.forEach(item=>presAppendItem(item.id,item.speaker,item.text,true));
  buildPresEngagementPanel();
  const sc=document.getElementById('pres-scroll');
  if(sc)setTimeout(()=>{sc.scrollTop=sc.scrollHeight;},50);
}

// Append a finalized bubble to presenter transcript
function presAppendItem(id,speaker,text,silent){
  const body=document.getElementById('pres-body');
  if(!body)return;
  // Remove the live/pending bubble first if it exists
  if(presLiveBubbleEl&&!silent){presLiveBubbleEl.remove();presLiveBubbleEl=null;}
  if(speaker!==presLastSpeaker){
    const lbl=document.createElement('div');
    lbl.className='pres-speaker-row';
    lbl.textContent=speaker;
    body.appendChild(lbl);
    presLastSpeaker=speaker;
  }
  const row=document.createElement('div');
  row.className='pres-bubble-row';
  const bub=document.createElement('div');
  bub.className='pres-bubble';
  bub.id='presbub-'+id;
  const txt=document.createElement('div');
  txt.textContent=text;
  bub.appendChild(txt);
  const footer=document.createElement('div');
  footer.className='pres-bubble-footer';
  footer.id='presfooter-'+id;
  row.appendChild(bub);
  row.appendChild(footer);
  body.appendChild(row);
  if(!silent){
    const sc=document.getElementById('pres-scroll');
    if(sc)sc.scrollTop=sc.scrollHeight;
  }
  presRefreshBubble(id);
}

// Show / update the live streaming bubble (non-final phrase)
function presUpdateLiveBubble(speaker,text){
  const body=document.getElementById('pres-body');
  if(!body)return;
  if(!presLiveBubbleEl){
    if(speaker!==presLastSpeaker){
      const lbl=document.createElement('div');
      lbl.className='pres-speaker-row';
      lbl.textContent=speaker;
      body.appendChild(lbl);
      presLastSpeaker=speaker;
    }
    presLiveBubbleEl=document.createElement('div');
    presLiveBubbleEl.className='pres-bubble pres-pending';
    body.appendChild(presLiveBubbleEl);
  }
  presLiveBubbleEl.textContent=text;
  const sc=document.getElementById('pres-scroll');
  if(sc)sc.scrollTop=sc.scrollHeight;
}

// Called when the live bubble is finalized
function presFinalizeLiveBubble(){
  if(presLiveBubbleEl){presLiveBubbleEl.remove();presLiveBubbleEl=null;}
}

// Refresh the engagement badges on one presenter bubble
function presRefreshBubble(id){
  const bub=document.getElementById('presbub-'+id);
  const footer=document.getElementById('presfooter-'+id);
  if(!bub||!footer)return;
  const isHL=highlighted.has(id);
  const myR=reactions[id]?[...reactions[id]]:[];
  const hasQ=myR.includes('❓');
  bub.className='pres-bubble'+(hasQ?' has-q':isHL?' has-eng':'');
  footer.innerHTML='';
  if(hasQ){
    const qb=document.createElement('span');
    qb.className='pres-q-badge';
    qb.textContent='❓ Question';
    footer.appendChild(qb);
  }
  if(isHL){
    const hb=document.createElement('span');
    hb.className='pres-hl-badge';
    hb.innerHTML='<svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M9 11L3 17V20H12L15 17" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 12l-4.6 4.6a2 2 0 01-2.8 0l-5.2-5.2a2 2 0 010-2.8L14 4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg> Highlighted';
    footer.appendChild(hb);
  }
  myR.filter(e=>e!=='❓').forEach(e=>{
    const rb=document.createElement('span');
    rb.className='pres-hl-badge';
    rb.style.fontSize='13px';
    rb.textContent=e;
    footer.appendChild(rb);
  });
  footer.style.display=footer.children.length?'flex':'none';
}

// Called after any highlight or reaction change; updates panel + transcript badges
function updatePresEngagement(changedId){
  if(document.getElementById('view-presenter').style.display==='none')return;
  if(changedId!=null)presRefreshBubble(changedId);
  buildPresEngagementPanel();
}

function buildPresEngagementPanel(){
  const questions=[],highlights=[];
  transcriptItems.forEach(item=>{
    const isHL=highlighted.has(item.id);
    const myR=reactions[item.id]?[...reactions[item.id]]:[];
    const hasQ=myR.includes('❓');
    if(hasQ)questions.push(item);
    if(isHL)highlights.push(item);
  });

  // Questions section
  const qList=document.getElementById('ep-q-list');
  const qSec=document.getElementById('ep-q-section');
  const divEl=document.getElementById('ep-divider');
  qList.innerHTML='';
  if(questions.length){
    qSec.style.display='block';
    if(divEl)divEl.style.display='block';
    questions.forEach(q=>{
      const el=document.createElement('div');
      el.className='ep-q-item';
      el.innerHTML=`<div class="ep-q-tag">❓ attendee question</div><div class="ep-q-text">${escapeHtml(q.text.length>100?q.text.slice(0,100)+'…':q.text)}</div>`;
      qList.appendChild(el);
    });
  }else{
    qSec.style.display='none';
    if(divEl)divEl.style.display='none';
  }

  // Highlights section
  const hlList=document.getElementById('ep-hl-list');
  hlList.innerHTML='';
  if(!highlights.length){
    hlList.innerHTML='<div class="ep-empty">Highlights from attendees appear here</div>';
  }else{
    highlights.forEach((h,i)=>{
      const pct=Math.round(((highlights.length-i)/highlights.length)*100);
      const el=document.createElement('div');
      el.className='ep-hl-item';
      el.innerHTML=`<div class="ep-hl-tag">▲ highlighted</div><div class="ep-hl-text">${escapeHtml(h.text.length>100?h.text.slice(0,100)+'…':h.text)}</div><div class="ep-bar-wrap"><div class="ep-bar" style="width:${pct}%"></div></div>`;
      hlList.appendChild(el);
    });
  }

  // Totals line
  const ep=document.getElementById('ep-total');
  if(ep)ep.textContent=highlighted.size+' highlight'+(highlighted.size!==1?'s':'')+' · '+questions.length+' question'+(questions.length!==1?'s':'');
}

function togglePresSection(key){
  const body=document.getElementById('pres-'+key+'-body');
  const chev=document.getElementById('pres-'+key+'-chev');
  const open=body.style.display!=='none';
  body.style.display=open?'none':'block';
  if(chev)chev.style.transform=open?'rotate(180deg)':'';
}
</script>
</body>
</html>
