use aho_corasick::{AhoCorasickBuilder, AhoCorasick};
use neon::prelude::*;

pub struct AhoCorasickBox {
    instance: Box<AhoCorasick>
}

declare_types! {
    pub class JsAhoCorasick for AhoCorasickBox {
        init(mut cx) {
            let patterns = cx.argument::<JsArray>(0)?
                .to_vec(&mut cx)?
                .into_iter()
                .map(|v| {
                    v.downcast::<JsString>()
                        .or_throw(&mut cx)
                        .map(|v| v.value())
                })
                .collect::<Result<Vec<_>, _>>()?;

            let options = cx.argument::<JsObject>(1)?;
            let case_sensitive = options
                .get(&mut cx, "caseSensitive")?
                .downcast::<JsBoolean>()
                .or_throw(&mut cx)?
                .value();

            let ac = AhoCorasickBuilder::new()
                .ascii_case_insensitive(!case_sensitive)
                .build(patterns);

            Ok(AhoCorasickBox { instance: Box::new(ac) })
        }

        method isMatch(mut cx) {
            let this = cx.this();
            let text = cx.argument::<JsString>(0)?
              .downcast::<JsString>()
              .or_throw(&mut cx)?
              .value();

            let result = {
                let guard = cx.lock();
                let ac = &this.borrow(&guard).instance;
                ac.is_match(text)
            };

            Ok(cx.boolean(result).upcast())
        }

        method findAll(mut cx) {
            let this = cx.this();
            let text = cx.argument::<JsString>(0)?
              .downcast::<JsString>()
              .or_throw(&mut cx)?
              .value();

            let result = {
                let guard = cx.lock();
                let mut matches = vec![];
                let ac = &this.borrow(&guard).instance;
                for mat in ac.find_iter(&text) {
                    matches.push(&text[mat.start()..mat.end()]);
                }
                matches.sort_unstable();
                matches.dedup();
                matches
            };

            let js_array = JsArray::new(&mut cx, result.len() as u32);
            result.iter()
                .enumerate()
                .for_each(|(i, obj)| {
                    let js_string = cx.string(obj);
                    js_array.set(&mut cx, i as u32, js_string).unwrap();
                });

            Ok(js_array.as_value(&mut cx))
        }
    }
}

register_module!(mut cx, {
    cx.export_class::<JsAhoCorasick>("AhoCorasick")?;
    Ok(())
});
