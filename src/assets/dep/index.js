  // this.listData[key].render.call(
                // this._renderProxy,
                // h,
                // { store: this.store, _self: this.context || this.$parent.$vnode.context })


                {
            selfRender.call(this._renderProxy, h, {
              column,
              row,
            })
          }




          Object.keys(columnConfig).map(key => columnConfig[key].render.call(
            renderProxy,
            h,
              {
                row,
              },
            ))

            this.rowConfig($index).class