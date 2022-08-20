import { AfterContentInit, Component, ContentChildren, OnInit, QueryList } from '@angular/core';
import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'app-tabs-container',
  templateUrl: './tabs-container.component.html',
  styleUrls: ['./tabs-container.component.css']
})
export class TabsContainerComponent implements AfterContentInit {

  @ContentChildren(TabComponent) tabs : QueryList<TabComponent> = new QueryList();
  activeTab: TabComponent | undefined;

  constructor() { }

  ngAfterContentInit(): void {
    console.log(this.tabs);
    this.activeTab = this.tabs.first;
    this.activeTab.active = true;
  }

  setActiveTab(tab: TabComponent) {
    this.tabs.forEach(t => {
      t.active = false;
    });

    this.activeTab = tab;
    tab.active = true;
    return false;
  }

}
